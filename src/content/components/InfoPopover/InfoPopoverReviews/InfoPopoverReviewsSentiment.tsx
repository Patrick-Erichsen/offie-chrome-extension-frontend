import { Box, Theme } from '@mui/material';
import { ReviewWithSentiment } from '../../../../types/Offie';

export interface InfoPopoverReviewsSentimentProps {
    sentiment: ReviewWithSentiment['sentiment'];
}

export const InfoPopoverReviewsSentiment = ({
    sentiment,
}: InfoPopoverReviewsSentimentProps): JSX.Element => {
    return (
        <Box
            sx={{
                width: 7.5,
                height: 7.5,
                borderRadius: 25,
                background: (theme: Theme) => {
                    return sentiment
                        ? theme.sentiment[sentiment]
                        : theme.sentiment.Neutral;
                },
            }}
        />
    );
};
