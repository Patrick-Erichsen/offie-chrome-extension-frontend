import { rollbar } from '../../utils/rollbar';

export const OFFIE_NODE_ID_PREFIX = 'offie-node';
export const LISTINGS_FOOTER_SECTION_ID = 'EXPLORE_NUMBERED_PAGINATION';
export const ITEM_LIST_EL = 'itemListElement';

export const getListingId = (listing: Element): string | null => {
    const urlMetaTag = listing.querySelector('meta[itemprop=url]');

    if (!urlMetaTag) {
        return null;
    }

    const urlWithoutProtocol = urlMetaTag.getAttribute('content');

    if (!urlWithoutProtocol) {
        return null;
    }

    const { pathname } = new URL(`http://${urlWithoutProtocol}`);

    const paths = pathname.split('/');

    const listingId = pathname.split('/')[paths.length - 1];

    return listingId;
};

export const getAllListingIds = (): string[] | null => {
    const listings = document.querySelectorAll(`div[itemprop=${ITEM_LIST_EL}]`);

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
        rollbar.error(
            `Failed to find the 'listing' var in ${getListingDetailsElem.name}`
        );
        return null;
    }

    // Traverse back to the top of the item DOM tree to avoid having to
    // use more fragile sibling based selectors
    const itemElement = listing.parentNode;

    if (!itemElement) {
        rollbar.error(
            `Failed to find the 'itemElement' var in ${getListingDetailsElem.name}`
        );
        return null;
    }

    const group = itemElement.querySelector(groupSelector);

    if (!group) {
        rollbar.error(
            `Failed to find the 'group' var in ${getListingDetailsElem.name}`
        );
        return null;
    }

    const listingDetails = group.children[2];

    if (!listingDetails) {
        rollbar.error(
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
    offieNode.style.paddingTop = '12px';

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

    /**
     * Heuristic: `Rare find` badge has a diamond svg
     */
    const isRareFindBadge = !!badgeContainer.querySelector('svg');

    /**
     * Determined by `isRareFindBadge`
     */
    let insertionIndex: number;

    if (isRareFindBadge) {
        const rareFindBadgeHidden = badgeContainer.children[0] as HTMLElement;
        rareFindBadgeHidden.style.setProperty('display', 'none', 'important');
        insertionIndex = 1;
    } else {
        insertionIndex = 0;
    }

    const displayBadge = badgeContainer.children[insertionIndex] as HTMLElement;

    badgeContainer.style.setProperty('gap', '5px');
    badgeContainer.style.setProperty('display', 'flex');
    displayBadge.style.setProperty('position', 'inherit', 'important');

    badgeContainer.insertBefore(offieNode, displayBadge);
};

/**
 * Checks if the `listingDetails` param has a badge.
 *
 * There are currently two known badge types:
 *   - Rare find
 *   - Date range
 *
 * The hueristic we use to determine if a property has a badge
 * is whether or not the first children of the second to last
 * row are `span` elements.
 */
export const hasBadge = (listingDetails: HTMLElement): boolean => {
    const secondToLast = listingDetails.children[
        listingDetails.childElementCount - 2
    ] as HTMLElement;

    return secondToLast.children[0].nodeName !== 'SPAN';
};

export const getOffieNodeId = (listingId: string): string => {
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

    if (hasBadge(listingDetails)) {
        insertBeforeBadge(listingDetails, offieNode);
    } else {
        insertNewDetailsRow(listingDetails, offieNode);
    }
};

export const createOffieNodes = (listingIds: string[]): void => {
    listingIds.forEach(async (listingId) => {
        const existingOffieNode = getOffieNode(listingId);

        if (!existingOffieNode) {
            insertOffieNode(listingId);
        }
    });
};

export const waitForListingsLoad = async (): Promise<void> => {
    let curWaitMs = 250;

    const waitIntervalMs = 250;
    const maxWaitMs = 30000;

    return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
            const listings = document.querySelectorAll(
                `div[itemprop=${ITEM_LIST_EL}]`
            );

            const hasListings = listings.length > 0;

            if (hasListings) {
                clearInterval(interval);
                resolve();
            } else if (curWaitMs <= maxWaitMs) {
                curWaitMs += waitIntervalMs;
            } else {
                reject(
                    new Error(
                        `Failed to wait for listings to load in ${maxWaitMs}ms`
                    )
                );
            }
        }, waitIntervalMs);
    });
};

export const waitForMapLoad = async (): Promise<void> => {
    let curWaitMs = 250;

    const waitIntervalMs = 250;
    const maxWaitMs = 30000;

    return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
            const mapMarkers = document.querySelectorAll('[data-veloute]');

            if (mapMarkers && mapMarkers.length > 0) {
                clearInterval(interval);
                resolve();
            } else if (curWaitMs <= maxWaitMs) {
                curWaitMs += waitIntervalMs;
            } else {
                reject(
                    new Error(`Failed to find a map marker in ${maxWaitMs}ms`)
                );
            }
        }, waitIntervalMs);
    });
};

export const waitForAirbnbSearchPageLoad = async (): Promise<void> => {
    await waitForMapLoad();
    await waitForListingsLoad();
};
