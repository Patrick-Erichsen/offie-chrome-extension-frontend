import { useState } from 'react';
import { useUrlChangeChrome } from './hooks/useUrlChangeChrome';
import { OffiePortals } from './components/OffiePortals';
import { isOffiePage, isSearchUrl } from './utils';
import './App.css';
import { logSearchUrl } from '../utils';

export const App = (): JSX.Element | null => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useUrlChangeChrome((newUrl) => {
        const newIsVisible = isOffiePage(newUrl);

        /**
         * Only render if on the homes search page
         */
        setIsVisible(newIsVisible);

        /**
         * Only log URL changes if we are on the homes search page
         */
        if (newIsVisible && isSearchUrl(newUrl)) {
            logSearchUrl(newUrl);
        }
    });

    if (!isVisible) {
        return null;
    }

    return <OffiePortals />;
};
