import Url from 'url-parse';

export const OFFIE_NODE_ID_PREFIX = 'offie-node';

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

export const getAllListingIds = (): string[] | null => {
    const listings = document.querySelectorAll('div[itemprop=itemListElement]');

    if (listings.length === 0) {
        return null;
    }

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
): void => {
    const lastRow =
        listingsDetails.children[listingsDetails.childElementCount - 1];

    // eslint-disable-next-line no-param-reassign
    offieNode.style.marginTop = '12px';

    listingsDetails.insertBefore(offieNode, lastRow);
};

export const insertBeforeBadge = (
    listingDetails: HTMLElement,
    offieNode: HTMLElement
): void => {
    const badgeContainer = listingDetails.children[
        listingDetails.childElementCount - 2
    ] as HTMLElement;

    if (!badgeContainer) {
        throw new Error(
            `Failed to find the 'badgeContainer' var in ${insertBeforeBadge.name}`
        );
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
};

const getOffieNodeId = (listingId: string) => {
    return `${OFFIE_NODE_ID_PREFIX}-${listingId}`;
};

export const getOffieNode = (listingId: string): Element | null => {
    const offieNodeId = getOffieNodeId(listingId);
    return document.getElementById(offieNodeId);
};

export const insertOffieNode = (listingId: string): void => {
    const listingDetails = getListingDetailsElem(listingId) as HTMLElement;

    if (!listingDetails) {
        throw new Error(
            `Failed to find listing details element for listing: ${listingId}`
        );
    }

    const offieNode = document.createElement('div');
    offieNode.id = getOffieNodeId(listingId);

    switch (listingDetails.childElementCount) {
        case NUM_ROWS_WITH_BADGE:
            insertBeforeBadge(listingDetails, offieNode);
            break;
        case NUM_ROWS_WITH_BUILDING_INFO || NUM_ROWS_WITHOUT_BUILDING_INFO:
            insertNewDetailsRow(listingDetails, offieNode);
            break;
        default:
            throw new Error(
                `Failed to find expected number of rows for listing: ${listingId}`
            );
    }
};

export const createOffieNodes = (listingIds: string[]): void => {
    listingIds.forEach((listingId) => {
        const existingOffieNode = getOffieNode(listingId);

        if (existingOffieNode) {
            return;
        }

        insertOffieNode(listingId);
    });
};
