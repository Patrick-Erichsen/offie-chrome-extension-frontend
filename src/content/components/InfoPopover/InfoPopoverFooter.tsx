import { Typography } from '@mui/material';
import AirbnbLink from '../AirbnbLink';

const InfoPopoverFooter = (): JSX.Element | null => {
    const discordInviteUrl = process.env.DISCORD_INVITE_URL;

    if (!discordInviteUrl) {
        return null;
    }

    return (
        <footer
            style={{
                height: 64,
                padding: '12px 24px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                flexWrap: 'wrap',
            }}
        >
            <Typography
                variant="subtitle2"
                textAlign="center"
                style={{
                    width: '100%',
                    color: '#717171',
                }}
            >
                <AirbnbLink
                    href={discordInviteUrl}
                    variant="subtitle2"
                    target="_blank"
                >
                    Join the Offie Discord
                </AirbnbLink>
            </Typography>

            <Typography
                textAlign="center"
                variant="caption"
                style={{
                    width: '100%',
                    color: '#717171',
                }}
            >
                Connect with other remote professional workers in the US
            </Typography>
        </footer>
    );
};

export default InfoPopoverFooter;
