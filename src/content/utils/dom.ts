import Url from 'url-parse';

const NUM_ROWS_WITH_RARE_FIND = 6;

const OFFIE_NODE_ID_PREFIX = 'offie-node-';

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

export const getListingsDetailsElem = (listingId: string): Element | null => {
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
            `Failed to find the listing details 'div' as the third sibling of the '${groupSelector} selector`
        );
        return null;
    }

    return listingDetails;
};

// Row for info on num guests, beds, baths, bedrooms
export const insertBuildingInfoRow = (
    listingDetails: Element,
    offieNode: HTMLElement
): boolean => {
    const buildingInfo = listingDetails.children[3];

    const { parentNode: buildingInfoParent, nextSibling: buildingInfoSibling } =
        buildingInfo;

    if (!buildingInfoParent) {
        console.error(
            'Failed to find parent node of the building info element'
        );
        return false;
    }

    if (!buildingInfoSibling) {
        console.error(
            'Failed to find next sibling node of the building info element'
        );
        return false;
    }

    // eslint-disable-next-line no-param-reassign
    offieNode.style.marginTop = '12px';

    buildingInfoParent.insertBefore(offieNode, buildingInfoSibling);

    return true;
};

export const insertBeforeRareFindBadge = (
    listingDetails: Element,
    offieNode: Element
): boolean => {
    const rareFind = listingDetails.children[4] as HTMLElement;

    rareFind.style.display = 'flex';

    const rareFindBadgeHidden = rareFind.children[0] as HTMLElement;

    console.log({ rareFindBadgeHidden });
    rareFindBadgeHidden.style.visibility = 'collapse';

    rareFind.insertBefore(offieNode, rareFindBadgeHidden);

    return true;
};

export const insertOffieNode = (
    listingDetails: Element,
    listingId: string
): Element | null => {
    const hasRareFind =
        listingDetails.children.length === NUM_ROWS_WITH_RARE_FIND;

    const offieNode = document.createElement('div');
    offieNode.id = `${OFFIE_NODE_ID_PREFIX}${listingId}`;

    // debugger;

    const insertionOpRes = hasRareFind
        ? insertBeforeRareFindBadge(listingDetails, offieNode)
        : insertBuildingInfoRow(listingDetails, offieNode);

    if (!insertionOpRes) {
        return null;
    }

    return offieNode;
};

export const cleanupOffieNodes = (): void => {
    const offieNodes = document.querySelectorAll(
        `div[id*="${OFFIE_NODE_ID_PREFIX}"]`
    );

    Array.from(offieNodes).forEach((node) =>
        node.parentNode?.removeChild(node)
    );
};
