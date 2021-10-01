import { Typography, Stack } from '@mui/material';

export interface InfoPopoverReviewsTitleProps {
    numReviews: number;
}

export const InfoPopoverReviewsTitle = ({
    numReviews,
}: InfoPopoverReviewsTitleProps): JSX.Element => {
    return (
        <Stack alignItems="center" spacing={0}>
            <Typography variant="subtitle1" component="h2">
                Reviews mentioning Wifi
            </Typography>

            <Typography variant="caption">
                {`${numReviews} ${numReviews === 1 ? 'review' : 'reviews'}`}
            </Typography>
        </Stack>
    );
};
