import { Stack, Typography } from '@mui/material';
import { InfoPopoverReviewsSentiment } from './InfoPopoverReviewsSentiment';
import { sentimentKeys } from '../../../utils';

const InfoPopoverReviewsSentimentsKey = (): JSX.Element => {
    return (
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
                <InfoPopoverReviewsSentiment
                    sentiment={sentimentKeys.POSITIVE}
                />
                <Typography variant="caption">Positive</Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={0.5}>
                <InfoPopoverReviewsSentiment sentiment={sentimentKeys.MIXED} />
                <Typography variant="caption">Mixed</Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={0.5}>
                <InfoPopoverReviewsSentiment
                    sentiment={sentimentKeys.NEGATIVE}
                />
                <Typography variant="caption">Negative</Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={0.5}>
                <InfoPopoverReviewsSentiment
                    sentiment={sentimentKeys.NEUTRAL}
                />
                <Typography variant="caption">Neutral</Typography>
            </Stack>
        </Stack>
    );
};

export default InfoPopoverReviewsSentimentsKey;
