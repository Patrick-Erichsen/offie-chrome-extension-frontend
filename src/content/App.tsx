import { useState, useEffect } from 'react';
import {
    createOffieNodes,
    getAllListingIds,
    waitForMapLoad,
    waitForListingsLoad,
} from './utils';
import { useUrlChrome } from './hooks/useUrlChrome';
import { OffiePortals } from './components/OffiePortals';

export const App = (): JSX.Element | null => {
    const [url, setUrl] = useState<string>(window.location.href);
    const [listingIds, setListingIds] = useState<string[] | null>(null);

    useUrlChrome((location) => {
        setListingIds(null);
        setUrl(location);
    });

    useEffect(() => {
        (async () => {
            await waitForMapLoad();
            await waitForListingsLoad();

            const newListingIds = getAllListingIds();

            if (newListingIds) {
                createOffieNodes(newListingIds);
                setListingIds(newListingIds);
            }
        })();
    }, [url]);

    if (!listingIds) {
        return null;
    }

    return <OffiePortals listingIds={listingIds} />;
};
