import Url from 'url-parse';

export const OFFIE_NODE_ID_PREFIX = 'offie-node-';

const NUM_ROWS_WITH_BADGE = 6;
const NUM_ROWS_WITH_BUILDING_INFO = 5;
const NUM_ROWS_WITHOUT_BUILDING_INFO = 4;

export const getListingId = (listing: Element): string | null => {
    const urlMetaTag = listing.querySelector('meta[itemprop=url]');

    if (!urlMetaTag) {
        return null;
    }

    const content = urlMetaTag.getAttribute('content');

    if (!content) {
        return null;
    }

    const { pathname } = new Url(content);
    const paths = pathname.split('/');

    // Listing ID is the last portion of the pathname
    const listingId = paths[paths.length - 1];

    return listingId;
};

export const getAllListingIds = (listings: NodeListOf<Element>): string[] => {
    return Array.from(listings).reduce((acc, listing) => {
        const listingId = getListingId(listing);

        if (listingId) {
            return [...acc, listingId];
        }

        return acc;
    }, [] as string[]);
};

export const getListingDetailsElem = (listingId: string): Element | null => {
    const listingSelector = `meta[itemprop=url][content*="${listingId}"]`;
    const groupSelector = 'div[role=group]';

    const listing = document.querySelector(listingSelector);

    if (!listing) {
        console.error(
            `Failed to find the 'listing' var in ${getListingDetailsElem.name}`
        );
        return null;
    }

    // Traverse back to the top of the item DOM tree to avoid having to
    // use more fragile sibling based selectors
    const itemElement = listing.parentNode;

    if (!itemElement) {
        console.error(
            `Failed to find the 'itemElement' var in ${getListingDetailsElem.name}`
        );
        return null;
    }

    const group = itemElement.querySelector(groupSelector);

    if (!group) {
        console.error(
            `Failed to find the 'group' var in ${getListingDetailsElem.name}`
        );
        return null;
    }

    const listingDetails = group.children[2];

    if (!listingDetails) {
        console.error(
            `Failed to find the 'listingDetails' var in ${getListingDetailsElem.name}`
        );
        return null;
    }

    return listingDetails;
};

export const insertNewDetailsRow = (
    listingsDetails: HTMLElement,
    offieNode: HTMLElement
): boolean => {
    const lastRow =
        listingsDetails.children[listingsDetails.childElementCount - 1];

    // eslint-disable-next-line no-param-reassign
    offieNode.style.marginTop = '12px';

    listingsDetails.insertBefore(offieNode, lastRow);

    return true;
};

export const insertBeforeBadge = (
    listingDetails: HTMLElement,
    offieNode: HTMLElement
): boolean => {
    const badgeContainer = listingDetails.children[
        listingDetails.childElementCount - 2
    ] as HTMLElement;

    if (!badgeContainer) {
        console.error(
            `Failed to find the 'badgeContainer' var in ${insertBeforeBadge.name}`
        );

        return false;
    }

    const numChildrenBadge = badgeContainer.childElementCount;

    const displayBadge = badgeContainer.children[
        numChildrenBadge - 1
    ] as HTMLElement;

    if (numChildrenBadge > 1) {
        const rareFindBadgeHidden = badgeContainer.children[0] as HTMLElement;
        rareFindBadgeHidden.style.setProperty('display', 'none', 'important');
    }

    badgeContainer.style.setProperty('gap', '5px');
    badgeContainer.style.setProperty('display', 'flex');
    displayBadge.style.setProperty('position', 'inherit', 'important');

    badgeContainer.insertBefore(offieNode, displayBadge);

    return true;
};

export const insertOffieNode = (
    listingId: string,
    offieNode: HTMLElement
): boolean => {
    const listingDetails = getListingDetailsElem(listingId) as HTMLElement;

    if (!listingDetails) {
        return false;
    }

    switch (listingDetails.childElementCount) {
        case NUM_ROWS_WITH_BADGE:
            return insertBeforeBadge(listingDetails, offieNode);
        case NUM_ROWS_WITH_BUILDING_INFO || NUM_ROWS_WITHOUT_BUILDING_INFO:
            return insertNewDetailsRow(listingDetails, offieNode);
        default:
            return false;
    }
};

export const getOffieNode = (listingId: string): Element | null => {
    const offieNodeId = `${OFFIE_NODE_ID_PREFIX}${listingId}`;

    const existingOffieNode = document.querySelector(`div[id*=${offieNodeId}]`);

    // Avoid re-rendering into the DOM if the node already exists.
    // This shouldn't happen, but is possible due to how React
    // schedules renders / commits
    if (existingOffieNode) {
        return existingOffieNode;
    }

    const offieNode = document.createElement('div');
    offieNode.id = offieNodeId;

    const insertionOpRes = insertOffieNode(listingId, offieNode);

    if (!insertionOpRes) {
        return null;
    }

    return offieNode;
};
