import * as mixpanel from 'mixpanel-browser';
import { WifiSentiment } from '../types/Offie';
import { getSearchLocation, getMappedSearchFilters } from './utils/airbnb';
import { getParsedUrlSearch } from './utils/misc';

export const eventNames = {
    AIRBNB_SEARCH_URL: 'airbnbSearchUrl',
    BUTTON_CLICK: 'offieButtonClick',
    MODAL_OPEN: 'offieModalOpen',
};

export const logUrlChange = (urlStr: string): void => {
    const search = getParsedUrlSearch(urlStr);

    const locations = getSearchLocation(search.query);
    const filters = getMappedSearchFilters(search);

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
