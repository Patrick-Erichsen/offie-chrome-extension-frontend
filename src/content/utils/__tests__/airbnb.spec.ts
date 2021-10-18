import * as airbnb from '../airbnb';

jest.mock('mixpanel-browser');

describe('airbnb.ts', () => {
    describe('getSearchLocation()', () => {
        it('returns a `country` key when one location is provided', () => {
            const locations = airbnb.getSearchLocation('United States');
            expect(locations.country).toEqual('United States');
        });

        it('returns a `state` key when two locations are provided', () => {
            const locations = airbnb.getSearchLocation('HI, United States');
            expect(locations.state).toEqual('HI');
        });

        it('returns a `city` key when three locations are provided', () => {
            const locations = airbnb.getSearchLocation(
                'Honolulu, HI, United States'
            );
            expect(locations.city).toEqual('Honolulu');
        });

        it('returns a `neighborhood` key when four locations are provided', () => {
            const locations = airbnb.getSearchLocation(
                'Waikīkī, Honolulu, HI, United States'
            );
            expect(locations.neighborhood).toEqual('Waikīkī');
        });

        it('returns a `poi` key when five locations are provided', () => {
            const locationStr = 'Oahu, Waikīkī, Honolulu, HI, United States';
            const locations = airbnb.getSearchLocation(locationStr);

            expect(locations.poi).toEqual('Oahu');
        });

        it('returns a `unknown` key with the full string if more than five locations are provided', () => {
            const locationStr =
                'Test, Oahu, Waikīkī, Honolulu, HI, United States';

            const locations = airbnb.getSearchLocation(locationStr);

            expect(locations.unknown).toEqual(locationStr);
        });

        it('returns an empty object if the param is undefined', () => {
            expect(airbnb.getSearchLocation(undefined)).toEqual({});
        });
    });

    describe('getFilterString()', () => {
        it('returns the mapped amenity', () => {
            expect(
                airbnb.getFilterString(['1'], airbnb.HOST_LANGUAGE_ID_TO_STR)
            ).toEqual([airbnb.HOST_LANGUAGE_ID_TO_STR[1]]);
        });
    });

    describe('getMappedSearchFilters()', () => {
        it('returns the acc if the val is undefined', () => {
            expect(airbnb.getMappedSearchFilters({ key: undefined })).toEqual(
                {}
            );
        });

        it('returns the value of `getFilterString` if the key is in our known list of numeric filters', () => {
            const mockVal = 'foo';
            const filterKey = Object.keys(airbnb.filterKeyToStringMap)[0];

            jest.spyOn(airbnb, 'getFilterString').mockReturnValueOnce([
                mockVal,
            ]);

            expect(
                airbnb.getMappedSearchFilters({ [filterKey]: 'bar' })
            ).toEqual({
                [filterKey]: [mockVal],
            });
        });

        it('returns the val if the key is not in the `airbnb.numericFilterKeyStrs` arr', () => {
            const obj = { test: 'bar' };
            expect(airbnb.getMappedSearchFilters(obj)).toEqual(obj);
        });
    });

    describe('hasWifiOrWorkspaceFilter()', () => {
        it('returns true is the url string has the wifi filter key', () => {
            const mockUrl = `https://www.airbnb.com/s/Downtown--Honolulu--HI--United-States/homes?amenities%5B%5D=${airbnb.WIFI_FILTER_KEY_NUM}`;

            expect(airbnb.hasWifiOrWorkspaceFilter(mockUrl)).toBe(true);
        });

        it('returns true is the url string has the dedicated workspace filter key', () => {
            const mockUrl = `https://www.airbnb.com/s/Downtown--Honolulu--HI--United-States/homes?amenities%5B%5D=${airbnb.DEDICATED_WORKSPACE_FILTER_KEY_NUM}`;

            expect(airbnb.hasWifiOrWorkspaceFilter(mockUrl)).toBe(true);
        });

        it('returns false is the url string does not have the dedicated workspace or wifi filter keys', () => {
            const mockUrl = `https://www.airbnb.com/s/Downtown--Honolulu--HI--United-States/homes`;

            expect(airbnb.hasWifiOrWorkspaceFilter(mockUrl)).toBe(false);
        });
    });
});
