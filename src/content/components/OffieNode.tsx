import { useState } from 'react';
import ReactDOM from 'react-dom';
import { ListingDetails } from '../types/Offie';
import { getListingsDetailsElem, insertOffieNode } from '../utils';
import { InfoButton } from './InfoButton';
import { InfoPopover } from './InfoPopover';

export interface OffieNodeProps {
    listingId: string;
    listingDetails: ListingDetails;
}

const OffieNode = ({
    listingId,
    listingDetails,
}: OffieNodeProps): JSX.Element | null => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const listingDetailsElem = getListingsDetailsElem(listingId);

    if (!listingDetailsElem) {
        return null;
    }

    const offieNode = insertOffieNode(listingDetailsElem, listingId);

    if (!offieNode) {
        return null;
    }

    return ReactDOM.createPortal(
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
        </>,
        offieNode
    );
};

export default OffieNode;
