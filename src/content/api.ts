/* eslint-disable import/prefer-default-export */
import { API } from 'aws-amplify';
import type { ListingsDetailsRes } from './types/Offie';

export const getListingsDetails = async (
    listingsIds: string[]
): Promise<ListingsDetailsRes | null> => {
    const apiName = process.env.API_GATEWAY_NAME;

    const params = {
        headers: {},
        response: true,
    };

    const path = listingsIds.reduce((acc, listingId) => {
        return `${acc}&listingId=${listingId}`;
    }, '/dev/listingsDetails?');

    try {
        const res = await API.get(apiName, path, params);

        return res.data.data;
    } catch (err) {
        console.log({ err });

        return null;
    }
};
