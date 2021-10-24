import { ChromeUrlUpdate } from '../types/Chrome';

chrome.tabs.onUpdated.addListener((tabId, { url }) => {
    if (url) {
        const newUrl: ChromeUrlUpdate = { event: 'URL_UPDATE', url };

        chrome.tabs.sendMessage(tabId, newUrl);
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.runtime.setUninstallURL('https://offie.co/uninstall');
});
