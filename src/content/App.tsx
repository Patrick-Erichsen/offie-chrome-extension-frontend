import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import OffieInfo from './components/OffieInfo';
import { getAllListingIds, insertOffieNode } from './utils';
import { ListingsDetailsRes } from '../types/Offie';
import * as api from './api';
import { ChromeUrlUpdate } from '../types/Chrome';

const App = (): JSX.Element | null => {
    const [location, setLocation] = useState<string>(window.location.href);
    const [listingsIds, setListingsIds] = useState<string[]>([]);
    const [listingsRes, setListingsRes] = useState<ListingsDetailsRes | null>(
        null
    );

    useEffect(() => {
        const updateLocationOnUrlChange = (request: ChromeUrlUpdate) => {
            // Clear state before setting new location that will trigger
            // a `useEffect` invokation
            setListingsRes(null);
            setListingsIds([]);

            setLocation(request.url);
        };

        chrome.runtime.onMessage.addListener(updateLocationOnUrlChange);

        return () => {
            chrome.runtime.onMessage.removeListener(updateLocationOnUrlChange);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            const listings = document.querySelectorAll(
                'div[itemprop=itemListElement]'
            );

            if (listings.length > 0) {
                // Need to clear interval before the async function
                clearInterval(interval);

                const newListingsIds = getAllListingIds(listings);

                setListingsIds(newListingsIds);
            }
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, [location]);

    useEffect(() => {
        const getNewListingsRes = async () => {
            const newListingsRes = await api.getListingsDetails(listingsIds);

            if (newListingsRes) {
                setListingsRes(newListingsRes);
            }
        };

        getNewListingsRes();
    }, [listingsIds]);

    if (!listingsRes) {
        return null;
    }

    const offiePortals = listingsIds.map((listingId) => {
        const offieNode = insertOffieNode(listingId);

        if (!offieNode) {
            return null;
        }

        return ReactDOM.createPortal(
            <OffieInfo
                listingDetails={listingsRes.listingsDetails[listingId]}
            />,
            offieNode
        );
    });

    return <>{...offiePortals}</>;
};

export default App;
