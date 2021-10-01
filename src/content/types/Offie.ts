import type { SentimentScore } from '@aws-sdk/client-comprehend';

export interface ListingsDetailsRes {
    listingsDetails: {
        [listingId: string]: ListingDetails;
    };
}

export type WifiKeywords = 'wifi' | 'wi-fi' | 'internet';

export type DedicatedWorkspaceAmenities =
    | 'table'
    | 'office chair'
    | 'desk'
    | 'monitor';

export interface ReviewWithSentiment {
    createdAt: string;
    comments: string;
    sentiment: keyof SentimentScore | null;
}

export interface WifiSentiment {
    overallSentiment: keyof SentimentScore | null;
    reviews: Array<ReviewWithSentiment> | null;
}

export interface ListingDetails {
    wifiSpeed: number | null;
    workspaceAmenities: Array<DedicatedWorkspaceAmenities> | null;
    wifiSentiment: WifiSentiment;
}
