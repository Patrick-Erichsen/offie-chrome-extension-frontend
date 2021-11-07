import type { SentimentScore } from '@aws-sdk/client-comprehend';
import * as qs from 'qs';
import { SentimenyKeysKeys, WifiSentiment } from '../../types/Offie';

export const OFFIE_URL = 'https://offie.co';

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

/**
 * Parse the search portion of a URL using our default configuration
 */
export const getParsedUrlSearch = (search: string): qs.ParsedQs => {
    return qs.parse(search, {
        ignoreQueryPrefix: true,
    });
};

export const getCapitalizedWorkspaceStr = (
    workspaceAmenities: string[]
): string => {
    const joinedStr = workspaceAmenities.join(', ');
    const capitalizedStr =
        joinedStr.charAt(0).toUpperCase() + joinedStr.slice(1);

    return capitalizedStr;
};
