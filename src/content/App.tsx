import { useState, useEffect } from 'react';
import Amplify from 'aws-amplify';
import OffieNode from './components/OffieNode';
import { getAllListingIds, cleanupOffieNodes } from './utils';
import amplifyConfig from './amplifyConfig';
import { ListingsDetailsRes } from './types/Offie';
import * as api from './api';

Amplify.configure(amplifyConfig);

const App = (): JSX.Element | null => {
    const [location, setLocation] = useState<string | null>(null);
    const [listingsIds, setListingsIds] = useState<string[]>([]);

    const [listingsRes, setListingsRes] = useState<ListingsDetailsRes | null>(
        null
    );

    chrome.runtime.onMessage.addListener((request) => {
        if (request.url) {
            setLocation(request.url);
        }
    });

    useEffect(() => {
        cleanupOffieNodes();

        const interval = setInterval(async () => {
            const listings = document.querySelectorAll(
                'div[itemprop=itemListElement]'
            );

            if (listings.length > 0) {
                // Need to clear interval before the async fn
                clearInterval(interval);

                const newListingsIds = getAllListingIds(listings);

                setListingsIds(newListingsIds);

                const newListingsRes = await api.getListingsDetails(
                    newListingsIds
                );

                if (newListingsRes) {
                    setListingsRes(newListingsRes);
                }
            }
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, [location]);

    if (!listingsRes) {
        return null;
    }

    return (
        <>
            {...listingsIds.map((listingId) => (
                <OffieNode
                    key={listingId}
                    listingId={listingId}
                    listingDetails={listingsRes.listingsDetails[listingId]}
                />
            ))}
        </>
    );
};

export default App;
