import type { SentimentScore } from '@aws-sdk/client-comprehend';
import { SentimenyKeysKeys, WifiSentiment } from '../../types/Offie';

export const WIFI_AMENITY_ID = 4;

export const sentimentKeys: {
    [key in SentimenyKeysKeys]: keyof SentimentScore;
} = {
    POSITIVE: 'Positive',
    MIXED: 'Mixed',
    NEUTRAL: 'Neutral',
    NEGATIVE: 'Negative',
};

export const isError = (err: unknown | Error): err is Error => {
    return (err as Error).message !== undefined;
};

export const sortReviewsByDateDesc = (
    reviews: NonNullable<WifiSentiment['reviews']>
): NonNullable<WifiSentiment['reviews']> => {
    return reviews
        .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
        .reverse();
};
