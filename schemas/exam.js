export default {
    name: 'exam',
    title: 'Egzaminai',
    type: 'document',
    fields: [
        {
            name: 'year',
            title: 'Metai',
            type: 'date',
            options: {
                dateFormat: 'YYYY',
            },
        },
        {
            name: 'level',
            title: 'Lygis',
            type: 'string',
            options: {
                layout: 'radio',
                list: ['Valstybinis', 'Mokyklinis'],
            },
        },
        {
            name: 'session',
            title: 'Sesija',
            type: 'string',
            options: {
                layout: 'radio',
                list: [
                    'Pagrindinė sesija',
                    'Pakartotinė sesija',
                    'Pavyzdinė užduotis',
                ],
            },
        },
        {
            name: 'answers',
            title: 'Atsakymai',
            type: 'file',
        },
        {
            name: 'questions',
            title: 'Klausimai',
            type: 'file',
        },
        {
            name: 'notes',
            title: 'Užrašai',
            type: 'string',
        },
    ],
    orderings: [
        {
            title: 'Metai, Naujausi',
            name: 'yearDesc',
            by: [{ field: 'year', direction: 'desc' }],
        },
    ],
    preview: {
        select: {
            metai: 'year',
            subject: 'subject',
            level: 'level',
            sesija: 'session',
        },
        prepare(selection = {}) {
            const { sesija, metai, level } = selection;
            return Object.assign({}, selection, {
                title: `${metai.split('-')[0]} ${
                    'Valstybinis' === level ? 'VBE' : 'MBE'
                } ${sesija.split(' ')[0]}`,
            });
        },
    },
};
