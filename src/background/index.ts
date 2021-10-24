import { ChromeUrlUpdate } from '../types/Chrome';

chrome.tabs.onUpdated.addListener((tabId, { url }) => {
    if (url) {
        const newUrl: ChromeUrlUpdate = { event: 'URL_UPDATE', url };

        chrome.tabs.sendMessage(tabId, newUrl);
    }
});

chrome.runtime.onInstalled.addListener(() => {
    const uninstallUrl = process.env.OFFIE_UNINSTALL_URL;

    if (uninstallUrl) {
        chrome.runtime.setUninstallURL(uninstallUrl);
    }
});
