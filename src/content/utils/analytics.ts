import * as mixpanel from 'mixpanel-browser';
import { getSearchLocation, getMappedSearchFilters } from './airbnb';
import { getParsedUrlSearch } from './misc';

export const logUrlChange = (urlStr: string): void => {
    const search = getParsedUrlSearch(urlStr);

    const locations = getSearchLocation(search.query);
    const filters = getMappedSearchFilters(search);

    mixpanel.track('airbnbSearchUrl', { ...locations, ...filters });
};
