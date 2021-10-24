import { ListingsDetailsRes } from '../../types/Offie';

const mockListingsDetailsRes: ListingsDetailsRes = {
    listingsDetails: {
        '27288379': {
            workspaceAmenities: null,
            wifiSpeed: null,
            wifiSentiment: {
                overallSentiment: 'Negative',
                reviews: [
                    {
                        createdAt: '2021-05-11T01:37:03Z',
                        comments:
                            'only downside is that the internet connectivity came and went and',
                        sentiment: 'Negative',
                    },
                    {
                        createdAt: '2021-05-22T18:22:17Z',
                        comments:
                            'its very loud and the wifi connection was poor',
                        sentiment: 'Negative',
                    },
                    {
                        createdAt: '2019-05-03T23:55:11Z',
                        comments:
                            'bathroom by the bedroom parking wifi and cable are included rich',
                        sentiment: 'Neutral',
                    },
                ],
            },
        },
        '47144474': {
            workspaceAmenities: ['desk', 'office chair'],
            wifiSpeed: 300,
            wifiSentiment: {
                overallSentiment: null,
                reviews: [],
            },
        },
    },
};

export default mockListingsDetailsRes;
