import { rollbar } from '../utils';
import { ChromeUninstallUrlUpdate, ChromeUrlUpdate } from '../types/Chrome';

export const isUninstallMsg = (
    msg: unknown | ChromeUninstallUrlUpdate
): msg is ChromeUninstallUrlUpdate => {
    return (
        (msg as ChromeUninstallUrlUpdate).event &&
        (msg as ChromeUninstallUrlUpdate).event === 'UPDATE_UNINSTALL_URL'
    );
};

chrome.tabs.onUpdated.addListener((tabId, { url }) => {
    if (url) {
        const newUrl: ChromeUrlUpdate = { event: 'URL_UPDATE', url };

        chrome.tabs.sendMessage(tabId, newUrl);
    }
});

chrome.runtime.onInstalled.addListener((details) => {
    // @ts-ignore
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        const environment = process.env.NODE_ENV;

        if (!environment) {
            rollbar.error(`Failed to find NODE_ENV env var!`);
            return;
        }

        if (process.env.NODE_ENV === 'production') {
            chrome.runtime.setUninstallURL('https://offie.co/uninstall');

            chrome.tabs.create({
                url: 'https://offie.co/welcome',
                active: true,
            });
        }
    }
});

chrome.runtime.onMessage.addListener((request) => {
    if (isUninstallMsg(request)) {
        chrome.runtime.setUninstallURL(request.uninstallUrl);
    }
});
