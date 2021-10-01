import { useState } from 'react';
import ReactDOM from 'react-dom';
import { ListingDetails } from './types/Offie';
import { InfoButton, InfoPopover } from './components';

export interface OffieInfoProps {
    listingId: string;
    listingDetails: ListingDetails;
}

/**
 * Building info is the row of data on a listing for number of guests,
 * beds, baths, etc.
 */
export const getBuildingInfoNode = (listingId: string): Element | null => {
    const listingSelector = `meta[itemprop=url][content*="${listingId}"]`;
    const groupSelector = 'div[role=group]';

    const listing = document.querySelector(listingSelector);

    if (!listing) {
        console.error(
            `Failed to find element with selector: '${listingSelector}'`
        );
        return null;
    }

    // Traverse back to the top of the item DOM tree to avoid having to
    // use more fragile sibling based selectors
    const itemElement = listing.parentNode;

    if (!itemElement) {
        console.error(
            `Failed to find parent node of element with selector: '${listingSelector}'`
        );
        return null;
    }

    const group = itemElement.querySelector(groupSelector);

    if (!group) {
        console.error(
            `Failed to find an element with the following selector: '${groupSelector}'`
        );
        return null;
    }

    const listingDetails = group.children[2];

    if (!listingDetails) {
        console.error(
            `Failed to find the listing details 'div' as the second sibling of the '${groupSelector} selector`
        );
        return null;
    }

    // Row for info on num guests, beds, baths, bedrooms
    const buildingInfo = listingDetails.children[3];

    if (!buildingInfo) {
        console.error(
            `Failed to find the building info 'div' as the third sibling of the listing details 'div'`
        );
        return null;
    }

    return buildingInfo;
};

const OffieInfo = ({
    listingId,
    listingDetails,
}: OffieInfoProps): JSX.Element | null => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const buildingInfo = getBuildingInfoNode(listingId);

    if (!buildingInfo) {
        return null;
    }

    const offieNode = document.createElement('div');

    const { parentNode: buildingInfoParent, nextSibling: buildingInfoSibling } =
        buildingInfo;

    if (!buildingInfoParent) {
        console.error(
            'Failed to find parent node of the building info element'
        );
        return null;
    }

    if (!buildingInfoSibling) {
        console.error(
            'Failed to find next sibling node of the building info element'
        );
        return null;
    }

    buildingInfoParent.insertBefore(offieNode, buildingInfoSibling);

    return ReactDOM.createPortal(
        <div>
            <InfoPopover
                listingDetails={listingDetails}
                onClose={handleClose}
                anchorEl={anchorEl}
            />
            <InfoButton
                onClick={handleClick}
                wifiSentiment={listingDetails.wifiSentiment}
            />
        </div>,
        offieNode
    );
};

export default OffieInfo;
