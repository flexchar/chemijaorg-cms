import client from 'part:@sanity/base/client';
import dd from './dd';

const fetchDocuments = () =>
    client.fetch(`*[_type == 'exam'  && defined(subject)][0...50]{_id}`);

const buildPatches = docs => {
    // dd(docs);

    return docs.map(doc => {
        return {
            id: doc._id,
            patch: {
                unset: ['subject'],
                // this will cause the transaction to fail if the documents has been
                // modified since it was fetched.
                ifRevisionID: doc._rev,
            },
        };
    });
};

const createTransaction = patches => {
    return patches.reduce(
        (tx, patch) => tx.patch(patch.id, patch.patch),
        client.transaction()
    );
};

const commitTransaction = tx => tx.commit();

const migrateNextBatch = async () => {
    const documents = await fetchDocuments();
    const patches = buildPatches(documents);
    if (patches.length === 0) {
        console.log('No more documents to migrate!');
        return null;
    }
    console.log(
        `Migrating batch:\n %s`,
        patches
            .map(patch => `${patch.id} => ${JSON.stringify(patch.patch)}`)
            .join('\n')
    );
    const transaction = createTransaction(patches);
    await commitTransaction(transaction);
    return migrateNextBatch();
};

migrateNextBatch().catch(err => {
    console.error(err);
    process.exit(1);
});
