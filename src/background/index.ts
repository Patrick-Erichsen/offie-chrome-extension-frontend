chrome.tabs.onUpdated.addListener((tabId, { url }) => {
    if (url) {
        chrome.tabs.sendMessage(tabId, { url });
    }
});
