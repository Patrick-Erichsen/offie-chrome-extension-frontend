import { useState } from 'react';
import { useUrlChangeChrome } from './hooks/useUrlChangeChrome';
import { OffiePortals } from './components/OffiePortals';
import { isHomesSearchPage } from './utils';
import './App.css';
import { logUrlChange } from '../utils';

export const App = (): JSX.Element | null => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useUrlChangeChrome((newUrl) => {
        /**
         * Only render if on the homes search page
         */
        setIsVisible(isHomesSearchPage(newUrl));

        /**
         * Only log URL changes from the root of the application
         */
        logUrlChange(newUrl);
    });

    if (!isVisible) {
        return null;
    }

    return <OffiePortals />;
};
