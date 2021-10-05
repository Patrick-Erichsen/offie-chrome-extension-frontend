import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import OffieInfo from './components/OffieInfo';
import { getAllListingIds, getOffieNode } from './utils';
import { ListingsDetailsRes } from '../types/Offie';
import * as api from './api';
import { ChromeUrlUpdate } from '../types/Chrome';

const App = (): JSX.Element | null => {
    const [location, setLocation] = useState<string>(window.location.href);
    const [listingsRes, setListingsRes] = useState<ListingsDetailsRes | null>(
        null
    );

    useEffect(() => {
        const updateLocationOnUrlChange = (request: ChromeUrlUpdate) => {
            // Clear state before setting new location that will trigger
            // a `useEffect` invokation
            setListingsRes(null);

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

                const listingIds = getAllListingIds(listings);

                const newListingsRes = await api.getListingsDetails(listingIds);

                setListingsRes(newListingsRes);
            }
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, [location]);

    if (!listingsRes) {
        return null;
    }

    const listingIds = Object.keys(listingsRes.listingsDetails);

    const offiePortals = listingIds.map((listingId) => {
        const offieNode = getOffieNode(listingId);

        if (!offieNode) {
            return null;
        }

        if (!listingsRes.listingsDetails[listingId]) {
            console.log(listingsRes.listingsDetails[listingId]);
            console.log(listingId);
            console.log(listingsRes);
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
