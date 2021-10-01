export default {
    API: {
        endpoints: [
            {
                // TODO: Does this need to match the name of our Lambda function?
                name: process.env.API_GATEWAY_NAME,
                endpoint: process.env.API_ENDPOINT,
            },
        ],
    },
};
