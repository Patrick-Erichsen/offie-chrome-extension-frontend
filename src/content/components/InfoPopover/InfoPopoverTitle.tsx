import { IconButton, Typography, Box } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

export interface InfoPopoverTitleProps {
    onClose: () => void;
}

export const InfoPopoverTitle = ({
    onClose,
}: InfoPopoverTitleProps): JSX.Element => {
    return (
        <header
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                borderBottom: '1px solid #ebebeb',
                padding: '0 24px',
                height: 64,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'absolute',
                    left: 0,
                    width: 64,
                }}
            >
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    style={{ color: '#232323' }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>

            <Typography
                variant="subtitle1"
                component="h1"
                textAlign="center"
                style={{ fontWeight: 'bolder' }}
            >
                Remote work details
            </Typography>
        </header>
    );
};
