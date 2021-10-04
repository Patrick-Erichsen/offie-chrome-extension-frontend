import { Stack } from '@mui/material';
import { WifiSentiment } from '../../../../types/Offie';
import { InfoPopoverReviewsBody } from './InfoPopoverReviewsBody';
import { InfoPopoverReviewsTitle } from './InfoPopoverReviewsTitle';
import InfoPopoverReviewsSentimentsKey from './InfoPopoverReviewsSentimentsKey';

export interface InfoPopoverReviewsProps {
    reviews: WifiSentiment['reviews'];
}

export const InfoPopoverReviews = ({
    reviews,
}: InfoPopoverReviewsProps): JSX.Element => {
    return (
        <Stack spacing={2}>
            <InfoPopoverReviewsTitle
                numReviews={reviews ? reviews.length : 0}
            />

            <InfoPopoverReviewsBody reviews={reviews} />

            {reviews && reviews.length > 0 && (
                <InfoPopoverReviewsSentimentsKey />
            )}
        </Stack>
    );
};
