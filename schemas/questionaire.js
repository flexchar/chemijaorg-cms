export default {
    name: 'questionnaire',
    title: 'Klausimynas',
    type: 'document',
    fields: [
        {
            name: 'category',
            title: 'Kategorija',
            type: 'string',
        },
        {
            name: 'question',
            title: 'Klausimas',
            type: 'text',
            rows: 2,
        },
        {
            name: 'answer',
            title: 'Atsakymas',
            type: 'text',
            rows: 2,
        },
        {
            name: 'points',
            title: 'Taškai',
            type: 'number',
        },
    ],
    preview: {
        select: {
            question: 'question',
            category: 'category',
        },
        prepare(selection = {}) {
            const { question, category } = selection;
            return {
                title: question,
                subtitle: category,
                ...selection,
            };
        },
    },
};
