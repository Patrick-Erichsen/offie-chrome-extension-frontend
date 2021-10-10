import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import OffieInfo from './components/OffieInfo';
import { getAllListingIds, getOffieNode, isError } from './utils';
import * as api from './api';
import { ListingsDetailsRes } from '../types/Offie';
import { useUrlChrome } from './hooks/useUrlChrome';

type ListingDetailsObj = ListingsDetailsRes['listingsDetails'];

// export const tryCreateOffieNodes = (listingIds: string[]): boolean => {
//     try {
//         createOffieNodes(listingIds);
//         return true;
//     } catch (err) {
//         if (isError(err)) {
//             console.error(
//                 `Failed to create Offie nodes with err: ${err.message}`
//             );
//         }

//         return false;
//     }
// };

const App = (): JSX.Element | null => {
    const [url, setUrl] = useState<string>(window.location.href);
    const [curListingIds, setCurListingIds] = useState<string[] | null>(null);
    const [listingDetails, setListingDetails] =
        useState<ListingDetailsObj | null>(null);

    useUrlChrome((newUrl) => {
        setCurListingIds(null);
        setUrl(newUrl);
    });

    // useEffect(() => {
    //     const interval = setInterval(async () => {
    //         const newListingIds = getAllListingIds();

    //         if (newListingIds) {
    //             clearInterval(interval);

    //             const createNodesRes = tryCreateOffieNodes(newListingIds);

    //             if (createNodesRes) {
    //                 setCurListingIds(newListingIds);
    //             }
    //         }
    //     }, 100);

    //     return () => {
    //         clearInterval(interval);
    //     };
    // }, [listingDetails, url]);

    useEffect(() => {
        const interval = setInterval(async () => {
            const listings = document.querySelectorAll(
                'div[itemprop=itemListElement]'
            );

            if (listings.length > 0) {
                // Need to clear interval before the async function
                clearInterval(interval);

                const newListingIds = getAllListingIds(listings);

                let listingIdsToFetch = newListingIds;

                if (listingDetails) {
                    const cachedListingIds = Object.keys(listingDetails);
                    listingIdsToFetch = newListingIds.filter(
                        (newId) => !cachedListingIds.includes(newId)
                    );
                }

                if (listingIdsToFetch.length > 0) {
                    const res = await api.getListingsDetails(listingIdsToFetch);

                    if (res) {
                        setListingDetails((oldListingDetails) => {
                            return {
                                ...oldListingDetails,
                                ...res.listingsDetails,
                            };
                        });
                    }
                }

                setCurListingIds(newListingIds);
            }
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, [listingDetails, url]);

    // useEffect(() => {
    //     const test = async (newListingIds: string[]) => {
    //         let listingIdsToFetch = newListingIds;

    //         if (listingDetails) {
    //             const cachedListingIds = Object.keys(listingDetails);
    //             listingIdsToFetch = newListingIds.filter(
    //                 (newId) => !cachedListingIds.includes(newId)
    //             );
    //         }

    //         if (listingIdsToFetch.length > 0) {
    //             const res = await api.getListingsDetails(listingIdsToFetch);

    //             if (res) {
    //                 setListingDetails((oldListingDetails) => {
    //                     return {
    //                         ...oldListingDetails,
    //                         ...res.listingsDetails,
    //                     };
    //                 });
    //             }
    //         }
    //     };

    //     if (curListingIds) {
    //         test(curListingIds);
    //     }
    // }, [curListingIds, listingDetails]);

    console.log({ listingDetails });

    if (!listingDetails || !curListingIds) {
        return null;
    }
    console.log(`cached listing ids: ${Object.keys(listingDetails).length}`);

    const offiePortals = curListingIds.map((listingId) => {
        const offieNode = getOffieNode(listingId);

        if (!offieNode) {
            return null;
        }

        if (!listingDetails[listingId]) {
            return null;
        }

        return ReactDOM.createPortal(
            <OffieInfo listingDetails={listingDetails[listingId]} />,
            offieNode
        );
    });

    return <>{...offiePortals}</>;
};

export default App;
