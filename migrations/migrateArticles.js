import client from './sanityClient';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(`${__dirname}/data.sqlite`);
const encoding = require('encoding');
const slugify = require('slugify');
const blockTools = require('@sanity/block-tools');
import schema from '../schemas/schema.js';

// The compiled schema type for the content type that holds the block array
const blockContentType = schema
    .get('article')
    .fields.find(field => field.name === 'body').type;
// Get the feature-set of a blockContentType
const features = blockTools.getBlockContentFeatures(blockContentType);
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const crypto = require('crypto');
const getRandomKey = () => crypto.randomBytes(12).toString('hex');

const getCategory = catId => {
    return {
        // Chemijos knyga
        9: 'd1a62812-e6be-4ce2-bbc8-bff1defcd511',
        12: 'd1a62812-e6be-4ce2-bbc8-bff1defcd511',
        // Bandymai
        8: 'a3290c4e-6bae-4050-979f-a8bab0b290b6',
        // Cheminiai reagentai, jų gamyba
        11: '8790043f-3b92-4661-b622-54b378a331fc',
        10: '8790043f-3b92-4661-b622-54b378a331fc',
        // Straipsniai
        7: '09b01109-1914-43e8-a07f-5715f38d52ee',
    }[catId];
};

// client.getDocument('64a2bee8-a79d-46d1-af09-7c6b54d1aef9').then(doc => {
// client.getDocument('09b01109-1914-43e8-a07f-5715f38d52ee').then(doc => {
//     dd(doc);
// });

function uploadArticle(entity) {
    const {
        article_id,
        article_cat,
        article_article,
        article_subject,
        article_datestamp,
        article_reads,
    } = entity;

    const title = encoding
        .convert(article_subject, 'utf-8', 'windows-1257')
        .toString();
    const body = encoding
        .convert(article_article, 'utf-8', 'windows-1257')
        .toString();

    const slug = slugify(title, { remove: /[*+~.()'"!:@]/g, lower: true });

    let bodyBlocks;
    try {
        bodyBlocks = blockTools.htmlToBlocks(body, blockContentType, {
            parseHtml: html => new JSDOM(html).window.document,
        });
    } catch (error) {
        // dd(body);
        bodyBlocks = body;
    }

    const data = {
        _type: 'article',
        _id: article_id,
        title,
        body: bodyBlocks,
        slug: {
            _type: 'slug',
            current: slug,
        },
        categories: [
            {
                _key: getRandomKey(),
                _type: 'reference',
                _ref: getCategory(article_cat),
            },
        ],
        legacy_urls: [`${slug},s${article_id}`, `${slug},s${article_id}.html`],
        _createdAt: new Date(article_datestamp * 1000).toISOString(),
        views: parseInt(article_reads),
    };

    // Ready to publish
    client.createOrReplace(data).then(res => {
        console.log(`Article migrated, doc ID is ${res._id}`);
    });
}

let articlesCounter = 0;
const articlesAmount = 30;
const SQL = `SELECT * FROM plxasc5354zxpui_articles LIMIT ${articlesAmount} OFFSET ${articlesCounter}`;
db.serialize(() => {
    let iteratorState = true;
    while (iteratorState) {
        db.each(SQL, (err, entity) => {
            if (err) {
                console.error(err);
                throw new Error(err);
            }

            if (entity) {
                uploadArticle(entity);
            } else iteratorState = false;
        });

        articlesCounter += articlesAmount;

        console.info('Uploading articles, current counter' + articlesCounter);
    }
});

db.close();
