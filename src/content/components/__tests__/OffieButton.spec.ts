import * as OffieButton from '../OffieButton';
import mockListingsDetailsRes from '../../__mocks__/mockListingsDetailsRes';
import type { ListingsDetailsRes, WifiSentiment } from '../../../types/Offie';
import { sentimentKeys } from '../../utils';

describe('<OffieButton />', () => {
    describe('getButtonText', () => {
        let mockListingsDetails: ListingsDetailsRes;
        let mockWifiSentiment: WifiSentiment;
        let mockNumWifiReviews: number;

        beforeEach(() => {
            mockListingsDetails = JSON.parse(
                JSON.stringify(mockListingsDetailsRes)
            );

            const listingDetails = Object.values(
                mockListingsDetails.listingsDetails
            );

            mockWifiSentiment = listingDetails[0].wifiSentiment;

            // @ts-ignore
            mockNumWifiReviews = listingDetails[0].wifiSentiment.reviews.length;
        });

        it('returns a `UNKNOWN` text when the reviews property is falsey', () => {
            mockWifiSentiment.reviews = null;

            expect(OffieButton.getButtonText(mockWifiSentiment)).toEqual(
                OffieButton.INFO_BUTTON_TEXT_VALS.UNKNOWN
            );
        });

        it('returns a `EMPTY_REVIEWS` text when the reviews array is empty', () => {
            mockWifiSentiment.reviews = [];

            expect(OffieButton.getButtonText(mockWifiSentiment)).toEqual(
                OffieButton.INFO_BUTTON_TEXT_VALS.EMPTY_REVIEWS
            );
        });

        it('returns a `NO_RECENT_REVIEWS` text when there are no reviews in the past 24 months', () => {
            // Limit to a single review
            // @ts-ignore ignore potentially null reviews property
            mockWifiSentiment.reviews = [mockWifiSentiment.reviews[0]];

            // @ts-ignore ignore potentially null reviews property
            mockWifiSentiment.reviews[0].createdAt = new Date(
                Date.now() - OffieButton.MS_TWO_YEARS
            ).toString();

            expect(OffieButton.getButtonText(mockWifiSentiment)).toEqual(
                OffieButton.INFO_BUTTON_TEXT_VALS.NO_RECENT_REVIEWS
            );
        });

        it('returns a `GOOD_WIFI` text when the reviews sentiment is positive', () => {
            mockWifiSentiment.overallSentiment = sentimentKeys.POSITIVE;

            expect(OffieButton.getButtonText(mockWifiSentiment)).toEqual(
                `${OffieButton.INFO_BUTTON_TEXT_VALS.GOOD_WIFI} (${mockNumWifiReviews})`
            );
        });

        it('returns a `OKAY_WIFI` text when the reviews sentiment is neutral', () => {
            mockWifiSentiment.overallSentiment = sentimentKeys.NEUTRAL;

            expect(OffieButton.getButtonText(mockWifiSentiment)).toEqual(
                `${OffieButton.INFO_BUTTON_TEXT_VALS.OKAY_WIFI} (${mockNumWifiReviews})`
            );
        });

        it('returns a `OKAY_WIFI` text when the reviews sentiment is mixed', () => {
            mockWifiSentiment.overallSentiment = sentimentKeys.MIXED;

            expect(OffieButton.getButtonText(mockWifiSentiment)).toEqual(
                `${OffieButton.INFO_BUTTON_TEXT_VALS.OKAY_WIFI} (${mockNumWifiReviews})`
            );
        });

        it('returns a `POOR_WIFI` text when the reviews sentiment is negative', () => {
            mockWifiSentiment.overallSentiment = sentimentKeys.NEGATIVE;

            expect(OffieButton.getButtonText(mockWifiSentiment)).toEqual(
                `${OffieButton.INFO_BUTTON_TEXT_VALS.POOR_WIFI} (${mockNumWifiReviews})`
            );
        });

        it('returns a `UNKNOWN` text when the reviews sentiment is unknown', () => {
            mockWifiSentiment.overallSentiment = null;

            expect(OffieButton.getButtonText(mockWifiSentiment)).toEqual(
                OffieButton.INFO_BUTTON_TEXT_VALS.UNKNOWN
            );
        });
    });
});
