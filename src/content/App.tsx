import { useState } from 'react';
import { useUrlChangeChrome } from './hooks/useUrlChangeChrome';
import { OffiePortals } from './components/OffiePortals';
import { hasWifiOrWorkspaceFilter, rollbarConfig } from './utils';
import Rollbar from 'rollbar';

export const App = (): JSX.Element | null => {
    // useState(new Rollbar(rollbarConfig));
    const [isVisible, setIsVisible] = useState<boolean>(false);

    /**
     * Only display our portals if the `Wifi` or
     * `Dedicated workspace` filters are active
     */
    useUrlChangeChrome((newUrl) => {
        const newIsVisible = hasWifiOrWorkspaceFilter(newUrl);
        setIsVisible(newIsVisible);
    });

    if (!isVisible) {
        return null;
    }

    return <OffiePortals />;
};
