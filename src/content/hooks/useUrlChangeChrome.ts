/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { ChromeUrlUpdate } from '../../types/Chrome';
import * as analytics from '../analytics';

/**
 * Invoke the `onUrlChange` param when Chrome detects that
 * the URL has changed.
 *
 * If the `runOnInit` param is not explicitly set to false,
 * the `onUrlChange` param is invoked on the initial render
 * with the value of `window.location.href`.
 *
 * Note: All URL changes are logged.
 */
export const useUrlChangeChrome = (
    onUrlChange: (url: string) => void,
    runOnInit = true
): void => {
    useEffect(() => {
        const onUrlChangeWrapper = (request: ChromeUrlUpdate) => {
            if (request.event === 'URL_UPDATE') {
                onUrlChange(request.url);
                analytics.logUrlChange(request.url);
            }
        };

        chrome.runtime.onMessage.addListener(onUrlChangeWrapper);

        if (runOnInit) {
            onUrlChange(window.location.href);
            analytics.logUrlChange(window.location.href);
        }

        return () => {
            chrome.runtime.onMessage.removeListener(onUrlChangeWrapper);
        };
    }, []);
};