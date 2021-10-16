import * as mixpanel from 'mixpanel-browser';
import * as qs from 'qs';
import {
    filterKeyToMap,
    AirbnbFilterKeyMap,
    airbnbArrayFilters,
    AirbnbArrayFilters,
} from './airbnb';

export interface AirbnbLocation {
    poi?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    country?: string;
    unknown?: string;
}

export type UrlQuery = {
    [key: string]: string | undefined;
};

export const getLocations = (query: qs.ParsedQs[string]): AirbnbLocation => {
    if (typeof query !== 'string') {
        console.error(
            `Expected 'query' param of URL string to be a string type! Found: ${query}`
        );

        return {};
    }

    const locations = query
        .split(', ')
        .map((location) => location.replace('-', ' '));

    if (locations.length > 5) {
        console.error(
            `Failed to find expected number of locations in Airbnb location string! Num locations found: ${locations.length}`
        );

        return { unknown: query };
    }

    const locationKeys: Array<keyof AirbnbLocation> = [
        'country',
        'state',
        'city',
        'neighborhood',
        'poi',
    ];

    return locationKeys.reduce((acc, key, i) => {
        return { ...acc, [key]: locations[locations.length - i - 1] };
    }, {});
};

export const getParsedFilterInts = (
    filters: Array<string | qs.ParsedQs>
): number[] => {
    const filterStrs = filters.filter(
        (val) => typeof val === 'string'
    ) as string[];

    return filterStrs.map((numStr) => parseInt(numStr, 10));
};

export const getMappedFilterVals = (
    filterVal: qs.ParsedQs[string],
    filterMap: AirbnbFilterKeyMap
): qs.ParsedQs[string] => {
    if (Array.isArray(filterVal)) {
        const parsedFilterInts = getParsedFilterInts(filterVal);

        return parsedFilterInts.map((filterNum) => filterMap[filterNum]);
    }

    return filterVal;
};

export const getFilters = (search: qs.ParsedQs): qs.ParsedQs => {
    return Object.entries(search).reduce((acc, [key, val]) => {
        if (!val) {
            return acc;
        }

        const airbnbFilterKey = key as AirbnbArrayFilters;

        if (airbnbArrayFilters.includes(airbnbFilterKey)) {
            return {
                ...acc,
                [key]: getMappedFilterVals(
                    val,
                    filterKeyToMap[airbnbFilterKey]
                ),
            };
        }

        return { ...acc, [key]: val };
    }, {});
};

export const getParsedSearch = (urlStr: string): { search: qs.ParsedQs } => {
    const { search } = new URL(urlStr);

    const searchWithoutQuestion = search.slice(1);
    const parsedSearch = qs.parse(searchWithoutQuestion);

    return { search: parsedSearch };
};

export const logUrlChange = (urlStr: string): void => {
    const { search } = getParsedSearch(urlStr);

    const locations = getLocations(search.query);
    const filters = getFilters(search);

    mixpanel.track('airbnbSearchUrl', { ...locations, ...filters });
};
