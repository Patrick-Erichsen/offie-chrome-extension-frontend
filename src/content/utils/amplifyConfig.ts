/* eslint-disable import/prefer-default-export */
export const amplifyConfig = {
    API: {
        endpoints: [
            {
                name: process.env.API_GATEWAY_NAME,
                endpoint: process.env.API_ENDPOINT,
            },
        ],
    },
};
