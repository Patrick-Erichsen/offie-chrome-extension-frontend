import * as analytics from '../analytics';
import { HOST_LANGUAGE_ID_TO_STR, airbnbArrayFilters } from '../airbnb';

export const mockAirbnbUrl =
    'https://www.airbnb.com/s/Downtown--Honolulu--HI--United-States/homes?tab_id=home_tab&refinement_paths%5B%5D=%2Fhomes&flexible_trip_dates%5B%5D=november&flexible_trip_dates%5B%5D=october&flexible_trip_lengths%5B%5D=weekend_trip&date_picker_type=calendar&query=Downtown%2C%20Honolulu%2C%20HI%2C%20United%20States&place_id=ChIJ5UJLbnNuAHwRgaIFcp7TTVE&source=structured_search_input_header&room_types%5B%5D=Private%20room&min_beds=2&min_bedrooms=1&min_bathrooms=1&superhost=true&amenities%5B%5D=4&amenities%5B%5D=47&amenities%5B%5D=25&amenities%5B%5D=12&property_type_id%5B%5D=2&property_type_id%5B%5D=8&languages%5B%5D=1';

jest.mock('mixpanel-browser');

describe('analytics.ts', () => {
    describe.only('getLocations()', () => {
        it('returns a `country` key when one location is provided', () => {
            const locations = analytics.getLocations('United States');
            expect(locations.country).toEqual('United States');
        });

        it('returns a `state` key when two locations are provided', () => {
            const locations = analytics.getLocations('HI, United States');
            expect(locations.state).toEqual('HI');
        });

        it('returns a `city` key when three locations are provided', () => {
            const locations = analytics.getLocations(
                'Honolulu, HI, United States'
            );
            expect(locations.city).toEqual('Honolulu');
        });

        it('returns a `neighborhood` key when four locations are provided', () => {
            const locations = analytics.getLocations(
                'Waikīkī, Honolulu, HI, United States'
            );
            expect(locations.neighborhood).toEqual('Waikīkī');
        });

        it('returns a `poi` key when five locations are provided', () => {
            const locationStr = 'Oahu, Waikīkī, Honolulu, HI, United States';
            const locations = analytics.getLocations(locationStr);

            expect(locations.poi).toEqual('Oahu');
        });

        it('returns a `unknown` key with the full string if more than five locations are provided', () => {
            const locationStr =
                'Test, Oahu, Waikīkī, Honolulu, HI, United States';

            const locations = analytics.getLocations(locationStr);

            expect(locations.unknown).toEqual(locationStr);
        });

        it('returns an empty object if the param is not a string', () => {
            expect(analytics.getLocations(['test'])).toEqual({});
        });
    });

    describe('getParsedFilterInts()', () => {
        it('returns an array of parsed ints', () => {
            expect(analytics.getParsedFilterInts(['1', '2'])).toEqual([1, 2]);
        });
    });

    describe('getMappedFilterVals()', () => {
        it('returns the mapped amenity if the filter is an array value', () => {
            jest.spyOn(analytics, 'getParsedFilterInts').mockReturnValueOnce([
                1,
            ]);

            expect(
                analytics.getMappedFilterVals(['1'], HOST_LANGUAGE_ID_TO_STR)
            ).toEqual([HOST_LANGUAGE_ID_TO_STR[1]]);
        });

        it('returns the filter if it is not an array', () => {
            expect(
                analytics.getMappedFilterVals('test', HOST_LANGUAGE_ID_TO_STR)
            ).toEqual('test');
        });
    });

    describe('getFilters()', () => {
        it('returns the acc if the val is undefined', () => {
            expect(analytics.getFilters({ key: undefined })).toEqual({});
        });

        it('returns the value of `getMappedFilterVals` if the key is in the `airbnbArrayFilters` arr', () => {
            const mockVal = 'foo';
            const filterKey = airbnbArrayFilters[0];

            jest.spyOn(analytics, 'getMappedFilterVals').mockReturnValueOnce(
                mockVal
            );

            expect(analytics.getFilters({ [filterKey]: 'bar' })).toEqual({
                [filterKey]: mockVal,
            });
        });

        it('returns the val if the key is not in the `airbnbArrayFilters` arr', () => {
            const obj = { test: 'bar' };
            expect(analytics.getFilters(obj)).toEqual(obj);
        });
    });

    describe('getUrlParts()', () => {
        it('returns the parsed query string without a question mark and the pathname', () => {
            const mockUrl = 'https://www.test.com/path?test=1';

            const { search } = analytics.getParsedSearch(mockUrl);

            expect(search).toEqual({ test: '1' });
        });
    });
});
