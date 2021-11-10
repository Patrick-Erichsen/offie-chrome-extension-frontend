import * as mixpanel from 'mixpanel-browser';
import { WifiSentiment } from '../types/Offie';
import {
    getSearchLocation,
    getMappedSearchFilters,
} from '../content/utils/airbnb';
import { getParsedUrlSearch } from '../content/utils/misc';
import { rollbar } from './rollbar';
import { ChromeUninstallUrlUpdate } from '../types/Chrome';

export const eventNames = {
    AIRBNB_SEARCH_URL: 'airbnbSearchUrl',
    BUTTON_CLICK: 'offieButtonClick',
    MODAL_OPEN: 'offieModalOpen',
};

export const initAnalytics = (): void => {
    const mixpanelToken = process.env.MIXPANEL_PROJECT_TOKEN;

    if (mixpanelToken) {
        mixpanel.init(mixpanelToken);
    } else {
        rollbar.error('Failed to find `MIXPANEL_PROJECT_TOKEN` env var!');
    }
};

export const tryIdentifyUserFromUrlParam = (url: string): void => {
    const { search } = new URL(url);

    const parsedSearch = getParsedUrlSearch(search);

    const urlMixpanelId = parsedSearch.mixpanel_id;

    if (typeof urlMixpanelId !== 'string') {
        return;
    }

    if (urlMixpanelId) {
        mixpanel.identify(urlMixpanelId);

        const updateUninstallPayload: ChromeUninstallUrlUpdate = {
            event: 'UPDATE_UNINSTALL_URL',
            uninstallUrl: `https://offie.co/uninstall?id=${mixpanel.get_distinct_id()}`,
        };

        chrome.runtime.sendMessage(updateUninstallPayload);
    }
};

export const logSearchUrl = (url: string): void => {
    const { search, pathname } = new URL(url);

    const decodedPathname = decodeURIComponent(pathname);
    const parsedSearch = getParsedUrlSearch(search);

    const locations = getSearchLocation(decodedPathname);
    const filters = getMappedSearchFilters(parsedSearch);

    mixpanel.track(eventNames.AIRBNB_SEARCH_URL, { ...locations, ...filters });
};

export const logOffieButtonClick = (
    listingIndex: number,
    listingId: string,
    { overallSentiment, reviews }: WifiSentiment
): void => {
    mixpanel.track(eventNames.BUTTON_CLICK, {
        listingIndex,
        listingId,
        overallSentiment,
        numReviews: reviews ? reviews.length : null,
    });
};

export const initModalTimer = (): void => {
    mixpanel.time_event(eventNames.MODAL_OPEN);
};

export const closeModalTimer = (): void => {
    mixpanel.track(eventNames.MODAL_OPEN);
};
