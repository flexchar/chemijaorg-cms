const fs = require('fs');
const sanityClient = require('@sanity/client');
const client = sanityClient({
    projectId: 'lv5ajubm',
    dataset: 'production',
    token:
        'skPrEnnOq6Brcphaws3EwnL4EGs0RFqIsfsLISoIc32JJhVFm11xUNJ0sQzOh0pcrkOh016bLYa4KLTmGed8SYqN0tnRRZnXcNxj4C7HTZMgBOUFW3Q67dBcgSYKWqZDUM3SNnLKeu2yfCRV9cXXAfY9uRIoAADI2nhcdMqs9EniZNXjtZzM',
    useCdn: false,
});
const toMarkdown = require('@sanity/block-content-to-markdown');
// const blocksToHtml = require('@sanity/block-content-to-html')

const serializers = {
    types: {
        // code: props =>
        //     h(
        //         'pre',
        //         { className: props.node.language },
        //         h('code', props.node.code)
        //     ),
    },
    marks: {
        super: props => `<sup>${props.children.join(' ')}</sup>`,
    },
};

client
    .fetch('*[_type == "article" && slug.current == "oksidacijos-laipsnis"][0]')
    .then(article => {
        if (!article) {
            console.info('Article not found');
            return;
        }
        const md = toMarkdown(article.body, {
            serializers,
            imageOptions: { w: 320, h: 240, fit: 'max' },
            projectId: 'lv5ajubm',
            dataset: 'production',
        });
        fs.writeFileSync(
            `${__dirname}/previews/${article.slug.current}.md`,
            md
        );
    });
