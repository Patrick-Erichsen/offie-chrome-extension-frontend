import { Button, ButtonProps } from '@mui/material';
import { NetworkCheck as NetworkCheckIcon } from '@mui/icons-material';
import { ReviewWithSentiment, WifiSentiment } from '../types/Offie';
import { sortReviewsByDateDesc, sentimentKeys } from '../utils';

export interface InfoButtonProps extends ButtonProps {
    wifiSentiment: WifiSentiment;
}

export type InfoButtonKeys =
    | 'UNKNOWN'
    | 'EMPTY_REVIEWS'
    | 'NO_RECENT_REVIEWS'
    | 'GOOD_WIFI'
    | 'OKAY_WIFI'
    | 'POOR_WIFI';

export type InfoButtonTextVals =
    | 'No Wifi info'
    | 'No reviews mentioning Wifi'
    | 'No recent Wifi reviews'
    | 'Good Wifi'
    | 'Okay Wifi'
    | 'Poor Wifi';

export const MS_TWO_YEARS = 63113904000;

export const INFO_BUTTON_TEXT_VALS: { [key: string]: InfoButtonTextVals } = {
    UNKNOWN: 'No Wifi info',
    EMPTY_REVIEWS: 'No reviews mentioning Wifi',
    NO_RECENT_REVIEWS: 'No recent Wifi reviews',
    GOOD_WIFI: 'Good Wifi',
    OKAY_WIFI: 'Okay Wifi',
    POOR_WIFI: 'Poor Wifi',
};

export const hasRecentWifiReviews = (
    reviews: ReviewWithSentiment[]
): boolean => {
    return !!reviews.find(
        (review) => Date.now() < Date.parse(review.createdAt) + MS_TWO_YEARS
    );
};

export const getButtonText = (wifiSentiment: WifiSentiment): string => {
    if (!wifiSentiment.reviews) {
        return INFO_BUTTON_TEXT_VALS.UNKNOWN;
    }

    const hasWifiReviews = wifiSentiment.reviews.length !== 0;

    if (!hasWifiReviews) {
        return INFO_BUTTON_TEXT_VALS.EMPTY_REVIEWS;
    }

    const sortedReviews = sortReviewsByDateDesc(wifiSentiment.reviews);

    if (!hasRecentWifiReviews(sortedReviews)) {
        return INFO_BUTTON_TEXT_VALS.NO_RECENT_REVIEWS;
    }

    switch (wifiSentiment.overallSentiment) {
        case sentimentKeys.POSITIVE:
            return INFO_BUTTON_TEXT_VALS.GOOD_WIFI;
        case sentimentKeys.MIXED:
            return INFO_BUTTON_TEXT_VALS.OKAY_WIFI;
        case sentimentKeys.NEUTRAL:
            return INFO_BUTTON_TEXT_VALS.OKAY_WIFI;
        case sentimentKeys.NEGATIVE:
            return INFO_BUTTON_TEXT_VALS.POOR_WIFI;
        default:
            return INFO_BUTTON_TEXT_VALS.UNKNOWN;
    }
};

export const InfoButton = ({
    onClick,
    wifiSentiment,
}: InfoButtonProps): JSX.Element => {
    const buttonText = getButtonText(wifiSentiment);

    return (
        <Button
            color="inherit"
            variant="outlined"
            onClick={onClick}
            style={{
                // Custom Styles
                textTransform: 'none',
                // Airbnb styles
                height: 24,
                padding: '3px 8px',
                borderRadius: 4,
                borderColor: '#dddddd',
                border: '0.5px solid rgb(221, 221, 221)',
                lineHeight: 18,
                fontSize: 14,
                fontWeight: 'bolder',
                outline: 0,
                color: 'rgb(34, 34, 34)',
            }}
            startIcon={<NetworkCheckIcon />}
        >
            {buttonText}
        </Button>
    );
};
