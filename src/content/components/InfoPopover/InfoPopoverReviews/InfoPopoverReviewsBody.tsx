import { Typography, Stack } from '@mui/material';
import { WifiSentiment, ReviewWithSentiment } from '../../../types/Offie';
import { InfoPopoverReviewsSentiment } from './InfoPopoverReviewsSentiment';

export interface InfoPopoverReviewsBodyProps {
    reviews: WifiSentiment['reviews'];
}

export interface InfoPopoverReviewItemProps {
    review: ReviewWithSentiment;
}

export const InfoPopoverReviewItem = ({
    review,
}: InfoPopoverReviewItemProps): JSX.Element => {
    const date = new Date(review.createdAt);

    const monthStr = date.toLocaleString('default', { month: 'short' });
    const yearStr = date.getFullYear();

    return (
        <Stack direction="row" spacing={4} justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={0.5}>
                <InfoPopoverReviewsSentiment sentiment={review.sentiment} />
                <Typography variant="body2">{`"${review.comments}"`}</Typography>
            </Stack>

            <Typography variant="caption">
                {`${monthStr} ${yearStr}`}
            </Typography>
        </Stack>
    );
};

export const InfoPopoverReviewsBody = ({
    reviews,
}: InfoPopoverReviewsBodyProps): JSX.Element => {
    // TODO: Better error message/display here
    if (!reviews) {
        return (
            <Typography variant="body2">
                Failed to check for reviews - there may be Wifi reviews for this
                listing
            </Typography>
        );
    }

    // TODO: Better error message/display here
    if (reviews.length === 0) {
        return (
            <Typography variant="body2">
                This listing has no reviews mentioning &apos;wifi&apos; or
                &apos;internet&apos;
            </Typography>
        );
    }

    return (
        <Stack spacing={1} style={{ width: '100%' }}>
            {...reviews.map((review) => (
                <InfoPopoverReviewItem review={review} key={review.createdAt} />
            ))}
        </Stack>
    );
};
