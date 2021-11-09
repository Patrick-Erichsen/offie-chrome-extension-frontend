import { WifiSentiment } from '../../../types/Offie';
import * as misc from '../misc';

describe('misc.ts', () => {
    describe('getParsedUrlSearch()', () => {
        it('returns a parsed URL with the question mark stripped from the search', () => {
            const { search } = new URL('https://www.test.com/path?test=1');

            const parsedSearch = misc.getParsedUrlSearch(search);

            // @ts-ignore
            expect(parsedSearch.test.includes('?')).toBe(false);
        });
    });

    describe('sortReviewsByDateDesc()', () => {
        it('returns a sorted array of reviews in descending order', () => {
            const newestDate = new Date(Date.now()).toString();
            const oldestDate = new Date(Date.now() - 1000).toString();

            // Oldest date is first in array
            const reviews = [
                { createdAt: oldestDate },
                { createdAt: newestDate },
            ] as NonNullable<WifiSentiment['reviews']>;

            const sortedReviews = misc.sortReviewsByDateDesc(reviews);

            expect(Date.parse(sortedReviews[0].createdAt)).toBeGreaterThan(
                Date.parse(sortedReviews[1].createdAt)
            );
        });
    });

    describe('getCapitalizedWorkspaceStr()', () => {
        it('returns a capitalized string of workspace amenities', () => {
            expect(
                misc.getCapitalizedWorkspaceStr(['office chair', 'desk'])
            ).toEqual('Office chair, desk');
        });
    });
});
