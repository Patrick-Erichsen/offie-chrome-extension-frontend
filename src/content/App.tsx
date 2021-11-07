import { useState } from 'react';
import { useUrlChangeChrome } from './hooks/useUrlChangeChrome';
import { OffiePortals } from './components/OffiePortals';
import { isHomesSearchPage } from './utils';
import './App.css';

export const App = (): JSX.Element | null => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useUrlChangeChrome((newUrl) => {
        /**
         * Only render if on the homes search page
         */
        setIsVisible(isHomesSearchPage(newUrl));
    });

    if (!isVisible) {
        return null;
    }

    return <OffiePortals />;
};
