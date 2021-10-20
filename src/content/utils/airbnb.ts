import * as qs from 'qs';
import { rollbar } from './rollbar';
import { getParsedUrlSearch } from './misc';

export interface AirbnbFilterKeyMap {
    [key: number]: string;
}
export interface AirbnbLocation {
    poi?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    country?: string;
    unknown?: string;
}

export type AirbnbSearchTypes =
    | 'AUTOSUGGEST'
    | 'HOMEPAGE_BANNER'
    | 'user_map_move'
    | 'section_navigation';

export type numericFilterKeyStrs =
    | 'amenities'
    | 'property_type_id'
    | 'languages';

export const WIFI_FILTER_KEY_NUM = 4;

export const DEDICATED_WORKSPACE_FILTER_KEY_NUM = 47;

/**
 * What is `kg_and_tags`? E.g. `Beachfront`, `Ski-in/ski-out` filters
 */
export const FILTERABLE_AMENITY_ID_TO_STR: AirbnbFilterKeyMap = {
    4: 'Wifi',
    5: 'Air conditioning',
    7: 'Pool',
    8: 'Kitchen',
    9: 'Free parking on premises',
    11: 'Smoking allowed',
    12: 'Pets allowed',
    15: 'Gym',
    16: 'Breakfast',
    25: 'Hot tub',
    27: 'Indoor fireplace',
    30: 'Heating',
    33: 'Washer',
    34: 'Dryer',
    35: 'Smoke alarm',
    36: 'Carbon monoxide alarm',
    45: 'Hair dryer',
    46: 'Iron',
    47: 'Dedicated workspace',
    51: 'Self check-in',
    58: 'TV',
    78: 'Private bathroom',
    97: 'EV charger',
    286: 'Crib',
};

export const PROPERTY_TYPE_ID_TO_STR: AirbnbFilterKeyMap = {
    1: 'Apartment',
    2: 'House',
    3: 'Bed and breakfast',
    4: 'Cabin',
    5: 'Castle',
    6: 'Treehouse',
    8: 'Boat',
    9: 'Dorm',
    10: 'Lighthouse',
    11: 'Villa',
    12: 'Igloo',
    15: 'Yurt',
    16: 'Tipi',
    17: 'Dome house',
    18: 'Cave',
    19: 'Island',
    22: 'Chalet',
    23: 'Earth house',
    24: 'Hut',
    25: 'Train',
    28: 'Plane',
    32: 'Camper/RV',
    33: 'Cottage',
    34: 'Tent',
    35: 'Loft',
    36: 'Townhouse',
    37: 'Condominium',
    38: 'Bungalow',
    39: 'Vacation home',
    40: 'Guesthouse',
    41: 'Floor',
    42: 'Hotel',
    43: 'Boutique hotel',
    44: 'Nature lodge',
    45: 'Hostel',
    46: 'Timeshare',
    47: 'Serviced apartment',
    48: 'Minsu',
    49: 'Ryokan',
    50: 'Pension',
    51: 'Hotel room',
    52: 'In-law',
    53: 'Guest suite',
    54: 'Casa particular',
    55: 'Pousada',
    56: 'Aparthotel',
    57: 'Barn',
    58: 'Campsite',
    59: 'Condohotel',
    60: 'Cottage',
    61: 'Cycladic house',
    62: 'Dammuso',
    63: 'Farm stay',
    64: 'Houseboat',
    65: 'Resort',
    66: "Shepherd's hut",
    67: 'Tiny house',
    68: 'Trullo',
    69: 'Windmill',
    70: 'Bus',
    71: 'Kezhan',
};

export const HOST_LANGUAGE_ID_TO_STR: AirbnbFilterKeyMap = {
    1: 'English',
    2: 'French',
    4: 'German',
    8: 'Japanese',
    16: 'Italian',
    32: 'Russian',
    64: 'Spanish',
    128: 'Chinese (Simplified)',
    256: 'Arabic',
    512: 'Hindi',
    1024: 'Portuguese',
    2048: 'Turkish',
    4096: 'Indonesian',
    8192: 'Dutch',
    16384: 'Korean',
    32768: 'Bengali',
    65536: 'Thai',
    131072: 'Punjabi',
    1048576: 'Hebrew',
    2097152: 'Polish',
    4194304: 'Malay',
    8388608: 'Tagalog',
    16777216: 'Danish',
    33554432: 'Swedish',
    67108864: 'Norwegian',
    134217728: 'Finnish',
    268435456: 'Czech',
    536870912: 'Hungarian',
    1073741824: 'Ukrainian',
};

/**
 * The keys of this object are the known search filter keys
 * whose values are an array type that uses numeric keys instead of
 * plaintext string values.
 *
 * The values of this object are the objects that map these numeric keys
 * to their corresponding string values.
 */
export const filterKeyToStringMap: {
    [key in numericFilterKeyStrs]: AirbnbFilterKeyMap;
} = {
    amenities: FILTERABLE_AMENITY_ID_TO_STR,
    property_type_id: PROPERTY_TYPE_ID_TO_STR,
    languages: HOST_LANGUAGE_ID_TO_STR,
};

/**
 * Parse our the individual location types from the `query` key
 * in `search` portion of a URL.
 */
export const getSearchLocation = (
    query: qs.ParsedQs[string]
): AirbnbLocation => {
    if (!query) {
        return {};
    }

    // Assume that the query value is a string
    // eslint-disable-next-line no-param-reassign
    query = query as string;

    const locations = query
        .split(', ')
        .map((location) => location.replace('-', ' '));

    if (locations.length > 5) {
        rollbar.warning(
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

/**
 * Iterate over an array of numeric filter values and get
 * the corresponding string value for each filter.
 */
export const getFilterString = (
    filterVal: string[],
    filterMap: AirbnbFilterKeyMap
): string[] => {
    return filterVal
        .map((numStr) => parseInt(numStr, 10))
        .map((filterNum) => filterMap[filterNum]);
};

/**
 * The `search` portion of a URL on the Airbnb search page corresponds
 * to the filter logic that is active on the page.
 *
 * Some of these filters use a numeric key instead of the plaintext
 * string value - e.g. the `Wifi` filter is represented by `4`.
 *
 * This method iterates over a parsed search object and maps
 * these number keys to their string values.
 *
 * Note: It is possible that the value of a given key is neither a string
 * nor a string array. As of now, Airbnb does not appear to use any nested
 * object types in their search URLs, so we've hardcoded the return values.
 */
export const getMappedSearchFilters = (
    search: qs.ParsedQs
): { [key: string]: string | string[] } => {
    return Object.entries(search).reduce((acc, [key, val]) => {
        if (!val) {
            return acc;
        }

        // Check if this key is in our known list of arrays that use
        // numeric values for the filter instead of a plaintex string
        const isFilterArray = Object.keys(filterKeyToStringMap).includes(
            key as numericFilterKeyStrs
        );

        if (isFilterArray) {
            return {
                ...acc,
                [key]: getFilterString(
                    val as string[],
                    filterKeyToStringMap[key as numericFilterKeyStrs]
                ),
            };
        }

        return { ...acc, [key]: val };
    }, {});
};

/**
 * Check if an Airbnb search URL contains a filter for `Wifi` or
 * `Dedicated workspaces`.
 */
export const hasWifiOrWorkspaceFilter = (urlStr: string): boolean => {
    const search = getParsedUrlSearch(urlStr);
    const filters = getMappedSearchFilters(search);

    const { amenities } = filters;

    // If a user has not applied any filters yet, return
    if (!amenities) {
        return false;
    }

    // We expect the amenities URL param to be an array type, so log an error
    // if it is not an array
    if (!Array.isArray(amenities)) {
        rollbar.warning(
            `Expected the amenities key to an array, but found: ${typeof amenities}`
        );

        return false;
    }

    const hasWifiFilter = amenities.includes(
        FILTERABLE_AMENITY_ID_TO_STR[WIFI_FILTER_KEY_NUM]
    );
    const hasDedicatedWorkspaceFilter = amenities.includes(
        FILTERABLE_AMENITY_ID_TO_STR[DEDICATED_WORKSPACE_FILTER_KEY_NUM]
    );

    return hasWifiFilter || hasDedicatedWorkspaceFilter;
};
