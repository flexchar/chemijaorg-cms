const fs = require('fs');
import client from './sanityClient';

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
