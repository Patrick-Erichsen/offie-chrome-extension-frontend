import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import {
    createOffieNodes,
    getAllListingIds,
    waitForAirbnbSearchPageLoad,
    getOffieNode,
} from './utils';
import { useUrlChrome } from './hooks/useUrlChrome';
import { ListingDetailsObj } from '../types/Offie';
import * as api from './api';
import { OffieButton } from './components/OffieButton';

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

export const App = (): JSX.Element | null => {
    const [url, setUrl] = useState<string>(window.location.href);
    const [listingIds, setListingIds] = useState<string[] | null>(null);
    const [viewedListingIds, setViewedListingIds] = useState<string[]>([]);
    const [listingsDetails, setListingsDetails] =
        useState<ListingDetailsObj | null>(null);

    useUrlChrome((url) => {
        setListingIds(null);
        setViewedListingIds([]);
        setUrl(url);
    });

    useEffect(() => {
        (async () => {
            await waitForAirbnbSearchPageLoad();

            const newListingIds = getAllListingIds();

            if (newListingIds) {
                createOffieNodes(newListingIds);
                setListingIds(newListingIds);
            }
        })();
    }, [url]);

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

    const portals = listingIds.map((listingId, index) => {
        const offieNode = getOffieNode(listingId);

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
        const onInView = () => {
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

        return ReactDOM.createPortal(
            <OffieButton
                key={listingId}
                onInView={onInView}
                listingDetails={
                    listingsDetails ? listingsDetails[listingId] : null
                }
            />,
            offieNode
        );
    });

    return <>{...portals}</>;
};
