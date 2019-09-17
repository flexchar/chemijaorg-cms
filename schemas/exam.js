export default {
    name: 'exam',
    title: 'Exam',
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
            name: 'sheet',
            title: 'Lapas',
            type: 'string',
            options: {
                layout: 'radio',
                list: ['Atsakymai', 'Užduotys'],
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
            title: 'Užduotis',
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
            name: 'file',
            title: 'Failas',
            type: 'file',
        },
        {
            name: 'notes',
            title: 'Užrašai',
            type: 'string',
        },
    ],
    preview: {
        select: {
            sheet: 'sheet',
            year: 'year',
            subject: 'subject',
        },
        prepare(selection = {}) {
            const { sheet, subject, year } = selection;
            return Object.assign({}, selection, {
                title: `${subject}: ${
                    year.split('-')[0]
                }  ${sheet.toLowerCase()}`,
            });
        },
    },
};
