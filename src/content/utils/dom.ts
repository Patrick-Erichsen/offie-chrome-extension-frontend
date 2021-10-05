import Url from 'url-parse';

export const RARE_FIND_TEXT = 'Rare find';
export const OFFIE_NODE_ID_PREFIX = 'offie-node-';

export const MONTH_THREE_CHAR_CAPS = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUNE',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
];

export const hasExpectedNumChildren = (
    elem: Element,
    numChildren: number,
    varName: string
): boolean => {
    if (elem.children.length < numChildren) {
        console.error(
            `Failed to find expected number of children elements of '${varName}' \
            Expected: ${numChildren}, Received: ${elem.children.length}`
        );

        return false;
    }

    return true;
};

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

export const insertNewDetailsRow = (
    listingDetails: Element,
    offieNode: HTMLElement
): boolean => {
    const lastChildIndex = listingDetails.children.length - 1;

    if (
        !hasExpectedNumChildren(
            listingDetails,
            1,
            `${insertNewDetailsRow.name}:listingDetails`
        )
    ) {
        return false;
    }

    const lastRow = listingDetails.children[lastChildIndex];

    // eslint-disable-next-line no-param-reassign
    offieNode.style.marginTop = '12px';

    listingDetails.insertBefore(offieNode, lastRow);

    return true;
};

export const setBadgeStyles = (
    badgeContainer: HTMLElement,
    badge: HTMLElement
): void => {
    badgeContainer.style.setProperty('gap', '5px');
    badgeContainer.style.setProperty('display', 'flex');
    badge.style.setProperty('position', 'inherit', 'important');
};

export const insertBeforeRareFindBadge = (
    listingDetails: Element,
    offieNode: HTMLElement
): boolean => {
    if (
        !hasExpectedNumChildren(
            listingDetails,
            5,
            `${insertBeforeRareFindBadge.name}:listingDetails`
        )
    ) {
        return false;
    }

    const rareFindContainer = listingDetails.children[4] as HTMLElement;

    if (
        !hasExpectedNumChildren(
            rareFindContainer,
            2,
            `${insertBeforeRareFindBadge.name}:rareFindContainer`
        )
    ) {
        return false;
    }

    const rareFindBadge = rareFindContainer.children[1] as HTMLElement;
    const rareFindBadgeHidden = rareFindContainer.children[0] as HTMLElement;

    setBadgeStyles(rareFindContainer, rareFindBadge);

    rareFindBadgeHidden.style.setProperty('display', 'none', 'important');

    rareFindContainer.insertBefore(offieNode, rareFindBadgeHidden);

    return true;
};

export const insertBeforeDatesBadge = (
    listingDetails: Element,
    offieNode: HTMLElement
): boolean => {
    if (
        !hasExpectedNumChildren(
            listingDetails,
            5,
            `${insertBeforeDatesBadge.name}:listingDetails`
        )
    ) {
        return false;
    }

    const datesBadgeContainer = listingDetails.children[4] as HTMLElement;

    if (
        !hasExpectedNumChildren(
            datesBadgeContainer,
            1,
            `${insertBeforeDatesBadge.name}:datesBadgeContainer`
        )
    ) {
        return false;
    }

    const datesBadge = datesBadgeContainer.children[0] as HTMLElement;

    setBadgeStyles(datesBadgeContainer, datesBadge);

    datesBadgeContainer.insertBefore(offieNode, datesBadge);

    return true;
};

export const hasDatesBadge = (listingDetails: HTMLElement): boolean => {
    const innerHtmlUpper = listingDetails.innerHTML.toUpperCase();

    return MONTH_THREE_CHAR_CAPS.some((month) => {
        return innerHtmlUpper.includes(month);
    });
};

export const hasRareFind = (listingDetails: HTMLElement): boolean => {
    return listingDetails.innerHTML.includes(RARE_FIND_TEXT);
};
export const insertOffieNode = (
    listingId: string,
    offieNode: HTMLElement
): boolean => {
    const listingDetails = getListingsDetailsElem(listingId) as HTMLElement;

    if (!listingDetails) {
        return false;
    }

    let insertionOpRes;

    if (hasRareFind(listingDetails)) {
        insertionOpRes = insertBeforeRareFindBadge(listingDetails, offieNode);
    } else if (hasDatesBadge(listingDetails)) {
        insertionOpRes = insertBeforeDatesBadge(listingDetails, offieNode);
    } else {
        insertionOpRes = insertNewDetailsRow(listingDetails, offieNode);
    }

    return insertionOpRes;
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
