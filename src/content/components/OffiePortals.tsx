import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ListingsDetailsRes } from '../../types/Offie';
import { getOffieNode } from '../utils';
import { OffieButton } from './OffieButton';
import * as api from '../api';

export interface OffiePortalsProps {
    listingIds: string[];
}

type ListingDetailsObj = ListingsDetailsRes['listingsDetails'];

export const INC_NUM_VIEWED_LISTINGS = 4;

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

export const OffiePortals = ({
    listingIds,
}: OffiePortalsProps): JSX.Element => {
    const [viewedListingIds, setViewedListingIds] = useState<string[]>([]);

    const [listingsDetails, setListingsDetails] =
        useState<ListingDetailsObj | null>(null);

    useEffect(() => {
        const getListingsRes = async () => {
            const newListingDetails = await getNewListingDetails(
                listingsDetails,
                viewedListingIds
            );

            if (newListingDetails) {
                setListingsDetails((oldListingDetails) => {
                    return { ...oldListingDetails, ...newListingDetails };
                });
            }
        };

        getListingsRes();
    }, [listingsDetails, viewedListingIds]);

    const portals = listingIds.map((listingId, index) => {
        const offieNode = getOffieNode(listingId);

        if (!offieNode) {
            return null;
        }

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
