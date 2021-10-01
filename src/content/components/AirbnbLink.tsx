import { styled } from '@mui/system';
import { Link, LinkProps } from '@mui/material';

const AirbnbLink = styled(Link)<LinkProps>({
    color: '#717171',
    textDecorationColor: '#717171',
    textDecorationLine: 'underline',
    ':hover': {
        textDecorationColor: '#222222',
        textDecorationLine: 'underline',
    },
});

export default AirbnbLink;
