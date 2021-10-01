import Url from 'url-parse';

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
