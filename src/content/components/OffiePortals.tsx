import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { InView, IntersectionObserverProps } from 'react-intersection-observer';
import {
    createOffieNodes,
    getAllListingIds,
    waitForAirbnbSearchPageLoad,
    getOffieNode,
} from '../utils';
import { useUrlChangeChrome } from '../hooks/useUrlChangeChrome';
import { ListingDetailsObj } from '../../types/Offie';
import * as api from '../api';
import { OffieButton } from './OffieButton';

/**
 * Number of listings that we load at a time.
 */
export const INC_NUM_VIEWED_LISTINGS = 4;

/**
 * Fetch the listings details for an array of listing IDs.
 *
 * The array of new listing IDs is filtered to remove any
 * ID that is present in the `cachedListings` object.
 */
export const getNewListingsDetails = async (
    cachedListings: ListingDetailsObj | null,
    newListingIds: string[]
): Promise<ListingDetailsObj | null> => {
    let listingIdsToFetch = newListingIds;

    if (cachedListings) {
        const cachedListingIds = Object.keys(cachedListings);

        listingIdsToFetch = newListingIds.filter(
            (newId) => !cachedListingIds.includes(newId)
        );
    }

    if (listingIdsToFetch.length > 0) {
        const res = await api.getListingsDetails(listingIdsToFetch);

        if (res) {
            return res.listingsDetails;
        }
    }

    return null;
};

export const OffiePortals = (): JSX.Element | null => {
    const [listingIds, setListingIds] = useState<string[] | null>(null);
    const [viewedListingIds, setViewedListingIds] = useState<string[]>([]);
    const [listingsDetails, setListingsDetails] =
        useState<ListingDetailsObj | null>(null);

    /**
     * On a URL change:
     *   - Clear previous state
     *   - Wait for the page to be fully loaded
     *   - Insert the DOM nodes that our Portal elements will render into
     *   - Parse and set the array of listing IDs
     */
    useUrlChangeChrome(async () => {
        setListingIds(null);
        setViewedListingIds([]);

        await waitForAirbnbSearchPageLoad();

        const newListingIds = getAllListingIds();

        if (newListingIds) {
            createOffieNodes(newListingIds);
            setListingIds(newListingIds);
        }
    });

    useEffect(() => {
        (async () => {
            const newListingDetails = await getNewListingsDetails(
                listingsDetails,
                viewedListingIds
            );

            if (newListingDetails) {
                setListingsDetails((oldListingDetails) => {
                    return { ...oldListingDetails, ...newListingDetails };
                });
            }
        })();
    }, [listingsDetails, viewedListingIds]);

    if (!listingIds) {
        return null;
    }

    /**
     * Note that the order of the indices here should correspond to the order
     * that they appear on the search page. This allows us to pass the index
     * of the array as a proxy for the actual ranking on the page.
     */
    const portals = listingIds.map((listingId, index) => {
        const offieNode = getOffieNode(listingId);

        const listingDetails = listingsDetails
            ? listingsDetails[listingId]
            : null;

        if (!offieNode) {
            return null;
        }

        /**
         * If a listing comes into view and has an index greater
         * than the current number of viewed listings, this indicates
         * that the listing details for the next block of
         * `INC_NUM_VIEWED_LISTINGS` listings needs to be fetched.
         *
         * Setting the `viewedListingIds` state var will trigger this.
         */
        const onInView: IntersectionObserverProps['onChange'] = (inView) => {
            if (!inView) {
                return;
            }

            const numViewedListings = viewedListingIds.length;

            if (index >= numViewedListings) {
                setViewedListingIds(
                    listingIds.slice(
                        0,
                        numViewedListings + INC_NUM_VIEWED_LISTINGS
                    )
                );
            }
        };

        const portalEl = (
            <InView triggerOnce onChange={onInView} rootMargin="50% 0%">
                {listingDetails ? (
                    <OffieButton
                        listingId={listingId}
                        listingDetails={listingDetails}
                        listingIndex={index}
                    />
                ) : null}
            </InView>
        );

        return ReactDOM.createPortal(portalEl, offieNode);
    });

    return <>{...portals}</>;
};
