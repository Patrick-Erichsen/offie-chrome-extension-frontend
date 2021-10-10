import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { OffieButton } from './components/OffieButton';
import { getAllListingIds, getOffieNode } from './utils';
import * as api from './api';
import { ListingsDetailsRes } from '../types/Offie';
import { useUrlChrome } from './hooks/useUrlChrome';

type ListingDetailsObj = ListingsDetailsRes['listingsDetails'];

export const getNewListingDetails = async (
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
    const [curListingIds, setCurListingIds] = useState<string[] | null>(null);
    const [listingDetails, setListingDetails] =
        useState<ListingDetailsObj | null>(null);

    useUrlChrome((newUrl) => {
        setCurListingIds(null);
        setUrl(newUrl);
    });

    useEffect(() => {
        const interval = setInterval(async () => {
            const listings = document.querySelectorAll(
                'div[itemprop=itemListElement]'
            );

            if (listings.length > 0) {
                // Need to clear interval before the async function
                clearInterval(interval);

                const newListingIds = getAllListingIds(listings);

                setCurListingIds(newListingIds);
            }
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, [listingDetails, url]);

    useEffect(() => {
        const getNonCachedListings = async (newListingIds: string[]) => {
            const newListingDetails = await getNewListingDetails(
                listingDetails,
                newListingIds
            );

            if (newListingDetails) {
                setListingDetails((oldListingDetails) => {
                    return {
                        ...oldListingDetails,
                        ...newListingDetails,
                    };
                });
            }
        };

        if (curListingIds) {
            getNonCachedListings(curListingIds);
        }
    }, [curListingIds, listingDetails]);

    if (!listingDetails || !curListingIds) {
        return null;
    }

    const offiePortals = curListingIds.map((listingId) => {
        const offieNode = getOffieNode(listingId);

        if (!offieNode) {
            return null;
        }

        if (!listingDetails[listingId]) {
            return null;
        }

        return ReactDOM.createPortal(
            <OffieButton listingDetails={listingDetails[listingId]} />,
            offieNode
        );
    });

    return <>{...offiePortals}</>;
};
