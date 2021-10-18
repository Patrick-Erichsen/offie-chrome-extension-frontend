/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import type { ListingsDetailsRes, OffieApiRes } from '../types/Offie';

export const getListingsDetails = async (
    listingsIds: string[]
): Promise<ListingsDetailsRes | null> => {
    const apiUrl = process.env.API_URL;

    if (!apiUrl) {
        console.error(
            'Failed to find `API_URL` env var! Aborting API request.'
        );

        return null;
    }

    const urlWithParams = listingsIds.reduce((acc, listingId) => {
        return `${acc}&listingId=${listingId}`;
    }, `${apiUrl}/dev/listingsDetails?`);

    try {
        const {
            data: { data },
        } = await axios.get<OffieApiRes<ListingsDetailsRes>>(urlWithParams);

        return data;
    } catch (err) {
        console.error({ err });

        return null;
    }
};
