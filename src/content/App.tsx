import { useState } from 'react';
import { useUrlChangeChrome } from './hooks/useUrlChangeChrome';
import { OffiePortals } from './components/OffiePortals';
import { hasWifiOrWorkspaceFilter, isHomesSearchPage } from './utils';
import './App.css';

export const App = (): JSX.Element | null => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useUrlChangeChrome((newUrl) => {
        /**
         * If a user is not on the search page, ignore the update
         */
        if (isHomesSearchPage(newUrl)) {
            const newIsVisible = hasWifiOrWorkspaceFilter(newUrl);

            setIsVisible(newIsVisible);
        }
    });

    /**
     * Only display our portals if the `Wifi` or
     * `Dedicated workspace` filters are active
     */
    if (!isVisible) {
        return null;
    }

    return <OffiePortals />;
};
