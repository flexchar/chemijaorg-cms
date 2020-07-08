import React from 'react';

export default {
    name: 'youtube',
    type: 'object',
    title: 'YouTube',
    fields: [
        {
            name: 'url',
            type: 'url',
            title: 'YouTube video URL',
        },
    ],
    preview: {
        select: {
            url: 'url',
        },
        component: ({ value }) => {
            const { url = '' } = value;
            const id = (url.split('watch?v=')[1] || '').split('&')[0];
            return (
                <iframe
                    id="ytplayer"
                    type="text/html"
                    width="100%"
                    height="480px"
                    src={`https://www.youtube.com/embed/${id}?modestbranding=1&rel=0`}
                    frameBorder="0"
                ></iframe>
            );
        },
    },
};
