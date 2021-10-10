import { useEffect } from 'react';
import { ChromeUrlUpdate } from '../../types/Chrome';

/**
 * Invoke the `onUrlChange` param when Chrome detects that
 * the
 */
export const useUrlChrome = (onUrlChange: (url: string) => void): void => {
    useEffect(() => {
        const onUrlChangeWrapper = (request: ChromeUrlUpdate) => {
            if (request.event === 'URL_UPDATE') {
                onUrlChange(request.url);
            }
        };

        chrome.runtime.onMessage.addListener(onUrlChangeWrapper);

        return () => {
            chrome.runtime.onMessage.removeListener(onUrlChangeWrapper);
        };
    }, [onUrlChange]);
};
