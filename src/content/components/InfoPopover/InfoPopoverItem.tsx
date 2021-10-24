import { Stack, Typography } from '@mui/material';

export interface InfoPopoverItemProps {
    title: string;
    value: string | null;
}

export const NO_VALUE_PLACEHOLDER = '-';

export const InfoPopoverItem = ({
    title,
    value,
}: InfoPopoverItemProps): JSX.Element => {
    return (
        <Stack direction="row" justifyContent="space-between">
            <Typography>{title}</Typography>
            <Typography>{value || NO_VALUE_PLACEHOLDER}</Typography>
        </Stack>
    );
};
