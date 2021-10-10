import { useState, useEffect } from 'react';
import { createOffieNodes, getAllListingIds, isError } from './utils';
import { useUrlChrome } from './hooks/useUrlChrome';
import { OffiePortals } from './components/OffiePortals';

export const tryCreateOffieNodes = (listingIds: string[]): boolean => {
    try {
        createOffieNodes(listingIds);
        return true;
    } catch (err) {
        if (isError(err)) {
            console.error(
                `Failed to create Offie nodes with err: ${err.message}`
            );
        }

        return false;
    }
};

export const App = (): JSX.Element | null => {
    const [url, setUrl] = useState<string>(window.location.href);
    const [listingIds, setListingIds] = useState<string[] | null>(null);

    useUrlChrome((location) => {
        setListingIds(null);
        setUrl(location);
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const newListingIds = getAllListingIds();

            if (newListingIds) {
                clearInterval(interval);

                const createNodesRes = tryCreateOffieNodes(newListingIds);

                if (createNodesRes) {
                    setListingIds(newListingIds);
                }
            }
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, [url]);

    if (!listingIds) {
        return null;
    }

    return <OffiePortals listingIds={listingIds} />;
};
