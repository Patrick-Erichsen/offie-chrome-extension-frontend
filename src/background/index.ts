import { ChromeUrlUpdate } from '../types/Chrome';
import * as analytics from '../content/analytics';

chrome.tabs.onUpdated.addListener((tabId, { url }) => {
    if (url) {
        const newUrl: ChromeUrlUpdate = { event: 'URL_UPDATE', url };

        chrome.tabs.sendMessage(tabId, newUrl);
    }
});

chrome.runtime.onInstalled.addListener(() => {
    const environment = process.env.NODE_ENV;

    if (!environment) {
        console.error(`Failed to find NODE_ENV env var!`);
        return;
    }

    if (process.env.NODE_ENV === 'production') {
        chrome.runtime.setUninstallURL(
            `https://offie.co/uninstall?id=${analytics.lib.get_distinct_id()}`
        );

        chrome.tabs.create({
            url: 'https://offie.co/welcome',
            active: true,
        });
    }
});
