export interface AirbnbFilterKeyMap {
    [key: number]: string;
}

export type AirbnbSearchTypes =
    | 'AUTOSUGGEST'
    | 'HOMEPAGE_BANNER'
    | 'user_map_move'
    | 'section_navigation';

export type AirbnbArrayFilters = 'amenities' | 'property_type_id' | 'languages';

export const airbnbArrayFilters: AirbnbArrayFilters[] = [
    'amenities',
    'property_type_id',
    'languages',
];

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

export const filterKeyToMap: {
    [key in AirbnbArrayFilters]: AirbnbFilterKeyMap;
} = {
    amenities: FILTERABLE_AMENITY_ID_TO_STR,
    property_type_id: PROPERTY_TYPE_ID_TO_STR,
    languages: HOST_LANGUAGE_ID_TO_STR,
};
