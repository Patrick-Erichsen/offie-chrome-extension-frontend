import { WifiSentiment } from '../../types/Offie';
import * as utils from '../utils';

describe('utils.ts', () => {
    describe('sortReviewsByDateDesc()', () => {
        it('returns a sorted array of reviews in descending order', () => {
            const newestDate = new Date(Date.now()).toString();
            const oldestDate = new Date(Date.now() - 1000).toString();

            // Oldest date is first in array
            const reviews = [
                { createdAt: oldestDate },
                { createdAt: newestDate },
            ] as NonNullable<WifiSentiment['reviews']>;

            const sortedReviews = utils.sortReviewsByDateDesc(reviews);

            expect(Date.parse(sortedReviews[0].createdAt)).toBeGreaterThan(
                Date.parse(sortedReviews[1].createdAt)
            );
        });
    });
});
