import { useState } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { Wifi as WifiIcon } from '@mui/icons-material';
import { ListingDetails, ReviewWithSentiment } from '../../types/Offie';
import { sortReviewsByDateDesc, sentimentKeys } from '../utils';
import * as analytics from '../analytics';
import { InfoPopover } from './InfoPopover';

export interface OffieButtonProps extends ButtonProps {
    listingId: string;
    listingIndex: number;
    listingDetails: ListingDetails;
}

export type OffieButtonKeys =
    | 'UNKNOWN'
    | 'EMPTY_REVIEWS'
    | 'NO_RECENT_REVIEWS'
    | 'GOOD_WIFI'
    | 'OKAY_WIFI'
    | 'POOR_WIFI';

export type OffieButtonTextVals =
    | 'No Wifi info'
    | 'No Wifi reviews'
    | 'No recent Wifi reviews'
    | 'Good Wifi'
    | 'Okay Wifi'
    | 'Poor Wifi';

export const MS_TWO_YEARS = 63113904000;

export const INFO_BUTTON_TEXT_VALS: { [key: string]: OffieButtonTextVals } = {
    UNKNOWN: 'No Wifi info',
    EMPTY_REVIEWS: 'No Wifi reviews',
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

export const getButtonText = (
    wifiSentiment: ListingDetails['wifiSentiment']
): string => {
    if (!wifiSentiment.reviews) {
        return INFO_BUTTON_TEXT_VALS.UNKNOWN;
    }

    const numWifiReviews = wifiSentiment.reviews.length;

    if (numWifiReviews === 0) {
        return INFO_BUTTON_TEXT_VALS.EMPTY_REVIEWS;
    }

    const sortedReviews = sortReviewsByDateDesc(wifiSentiment.reviews);

    if (!hasRecentWifiReviews(sortedReviews)) {
        return INFO_BUTTON_TEXT_VALS.NO_RECENT_REVIEWS;
    }

    const numWifiReviewsStr = `(${numWifiReviews})`;

    switch (wifiSentiment.overallSentiment) {
        case sentimentKeys.POSITIVE:
            return `${INFO_BUTTON_TEXT_VALS.GOOD_WIFI} ${numWifiReviewsStr}`;
        case sentimentKeys.MIXED:
            return `${INFO_BUTTON_TEXT_VALS.OKAY_WIFI} ${numWifiReviewsStr}`;
        case sentimentKeys.NEUTRAL:
            return `${INFO_BUTTON_TEXT_VALS.OKAY_WIFI} ${numWifiReviewsStr}`;
        case sentimentKeys.NEGATIVE:
            return `${INFO_BUTTON_TEXT_VALS.POOR_WIFI} ${numWifiReviewsStr}`;
        default:
            return INFO_BUTTON_TEXT_VALS.UNKNOWN;
    }
};

export const OffieButton = ({
    listingDetails,
    listingIndex,
    listingId,
}: OffieButtonProps): JSX.Element => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);

        analytics.logOffieButtonClick(
            listingIndex,
            listingId,
            listingDetails.wifiSentiment
        );

        // Used to time how long a user interacts with the modal
        analytics.initModalTimer();
    };

    const handleClose = () => {
        setAnchorEl(null);

        analytics.closeModalTimer();
    };

    return (
        <>
            <InfoPopover
                listingDetails={listingDetails}
                onClose={handleClose}
                anchorEl={anchorEl}
            />
            <Button
                color="inherit"
                variant="outlined"
                onClick={handleClick}
                style={{
                    // Custom Styles
                    textTransform: 'none',
                    fontWeight: 'bolder',
                    fontSize: 13,
                    // Airbnb styles
                    height: 24,
                    padding: '3px 8px',
                    borderRadius: 4,
                    borderColor: '#dddddd',
                    border: '0.5px solid rgb(221, 221, 221)',
                    lineHeight: 18,
                    outline: 0,
                    color: 'rgb(34, 34, 34)',
                }}
                startIcon={<WifiIcon />}
            >
                {getButtonText(listingDetails.wifiSentiment)}
            </Button>
        </>
    );
};
