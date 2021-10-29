import mixpanel from 'mixpanel-browser';
import { rollbar, initAnalytics, logUrlChange } from '../utils';
import { ChromeUrlUpdate } from '../types/Chrome';

initAnalytics();

chrome.tabs.onUpdated.addListener((tabId, { url }) => {
    if (url) {
        logUrlChange(url);

        const newUrl: ChromeUrlUpdate = { event: 'URL_UPDATE', url };

        chrome.tabs.sendMessage(tabId, newUrl);
    }
});

chrome.runtime.onInstalled.addListener(() => {
    const environment = process.env.NODE_ENV;

    if (!environment) {
        rollbar.error(`Failed to find NODE_ENV env var!`);
        return;
    }

    if (process.env.NODE_ENV === 'production') {
        chrome.runtime.setUninstallURL(
            `https://offie.co/uninstall?id=${mixpanel.get_distinct_id()}`
        );

        chrome.tabs.create({
            url: 'https://offie.co/welcome',
            active: true,
        });
    }
});
