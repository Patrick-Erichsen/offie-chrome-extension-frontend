import * as airbnb from '../airbnb';

jest.mock('mixpanel-browser');

describe('airbnb.ts', () => {
    describe('getSearchLocation()', () => {
        it('returns a `country` key when one location is provided', () => {
            const locations = airbnb.getSearchLocation(
                '/s/United States/homes'
            );
            expect(locations.country).toEqual('United States');
        });

        it('returns a `state` key when two locations are provided', () => {
            const locations = airbnb.getSearchLocation(
                '/s/HI--United-States/homes'
            );
            expect(locations.state).toEqual('HI');
        });

        it('returns a `city` key when three locations are provided', () => {
            const locations = airbnb.getSearchLocation(
                '/s/Honolulu--HI--United-States/homes'
            );
            expect(locations.city).toEqual('Honolulu');
        });

        it('returns a `neighborhood` key when four locations are provided', () => {
            const locations = airbnb.getSearchLocation(
                '/s/Waikīkī--Honolulu--HI--United-States/homes'
            );
            expect(locations.neighborhood).toEqual('Waikīkī');
        });

        it('returns a `poi` key when five locations are provided', () => {
            const locations = airbnb.getSearchLocation(
                '/s/Oahu--Waikīkī--Honolulu--HI--United-States/homes'
            );

            expect(locations.poi).toEqual('Oahu');
        });

        it('returns a `unknown` key with the full string if more than five locations are provided', () => {
            const locationStr =
                '/s/Test--Oahu--Waikīkī--Honolulu--HI--United-States/homes';

            const locations = airbnb.getSearchLocation(locationStr);

            expect(locations.unknown).toEqual(locationStr);
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

    describe('isOffiePage()', () => {
        it('returns true if homes page', () => {
            expect(airbnb.isOffiePage('https://www.airbnb.com/s/homes')).toBe(
                true
            );
        });

        it('returns true if wishlist page', () => {
            expect(
                airbnb.isOffiePage('https://www.airbnb.com/wishlists/998790603')
            ).toBe(true);
        });

        it('returns false if not an offie page', () => {
            expect(airbnb.isOffiePage('https://www.airbnb.com')).toBe(false);
        });
    });
});
