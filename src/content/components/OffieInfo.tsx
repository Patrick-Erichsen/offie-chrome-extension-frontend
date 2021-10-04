import { useState } from 'react';
import { ListingDetails } from '../../types/Offie';
import { InfoButton } from './InfoButton';
import { InfoPopover } from './InfoPopover';

export interface OffieInfoProps {
    listingDetails: ListingDetails;
}

const OffieInfo = ({ listingDetails }: OffieInfoProps): JSX.Element | null => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <InfoPopover
                listingDetails={listingDetails}
                onClose={handleClose}
                anchorEl={anchorEl}
            />
            <InfoButton
                onClick={handleClick}
                wifiSentiment={listingDetails.wifiSentiment}
            />
        </>
    );
};

export default OffieInfo;
