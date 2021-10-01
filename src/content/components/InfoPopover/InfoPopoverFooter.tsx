import { Typography, Link } from '@mui/material';
import AirbnbLink from '../AirbnbLink';

const InfoPopoverFooter = (): JSX.Element => {
    return (
        <footer
            style={{
                height: 48,
                padding: '0 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
            }}
        >
            <Typography
                variant="subtitle2"
                style={{
                    color: '#717171',
                }}
            >
                <AirbnbLink
                    href={`${process.env.OFFIE_URL}/feedback`}
                    variant="subtitle2"
                >
                    Feedback
                </AirbnbLink>
            </Typography>

            <Typography
                variant="subtitle2"
                style={{
                    color: '#717171',
                }}
            >
                Made by{' '}
                <AirbnbLink
                    href={process.env.OFFIE_URL}
                    target="_blank"
                    rel="noopener"
                    variant="subtitle2"
                >
                    Offie
                </AirbnbLink>
            </Typography>
        </footer>
    );
};

export default InfoPopoverFooter;
