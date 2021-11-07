/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { ChromeUrlUpdate } from '../../types/Chrome';
import {
    logUrlChange,
    tryIdentifyUserFromUrlParam,
} from '../../utils/analytics';

/**
 * Invoke the `onUrlChange` param when Chrome detects that
 * the URL has changed.
 *
 * If the `runOnInit` param is not explicitly set to false,
 * the `onUrlChange` param is invoked on the initial render
 * with the value of `window.location.href`.
 */
export const useUrlChangeChrome = (
    onUrlChange: (url: string) => void,
    runOnInit = true
): void => {
    useEffect(() => {
        const onUrlChangeWrapper = (request: ChromeUrlUpdate) => {
            if (request.event === 'URL_UPDATE') {
                logUrlChange(request.url);
                onUrlChange(request.url);
            }
        };

        chrome.runtime.onMessage.addListener(onUrlChangeWrapper);

        if (runOnInit) {
            logUrlChange(window.location.href);
            onUrlChange(window.location.href);
        }

        tryIdentifyUserFromUrlParam(window.location.href);

        return () => {
            chrome.runtime.onMessage.removeListener(onUrlChangeWrapper);
        };
    }, []);
};
