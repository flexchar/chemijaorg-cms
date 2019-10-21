const sanityClient = require('@sanity/client');
export default sanityClient({
    projectId: 'lv5ajubm',
    dataset: 'production',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
    withCredentials: true,
});
