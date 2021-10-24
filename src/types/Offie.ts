import type { SentimentScore } from '@aws-sdk/client-comprehend';

export type SentimenyKeysKeys = 'POSITIVE' | 'MIXED' | 'NEUTRAL' | 'NEGATIVE';

export interface OffieApiRes<T> {
    error: {
        message: string;
    };
    data: T;
}

export interface ListingDetailsObj {
    [listingId: string]: ListingDetails;
}

export interface ListingsDetailsRes {
    listingsDetails: ListingDetailsObj;
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
