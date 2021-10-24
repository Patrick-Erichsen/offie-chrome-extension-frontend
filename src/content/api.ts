/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { rollbar } from './utils';
import type { ListingsDetailsRes, OffieApiRes } from '../types/Offie';

export const getListingsDetails = async (
    listingsIds: string[]
): Promise<ListingsDetailsRes | null> => {
    const apiUrl = process.env.API_URL;

    if (!apiUrl) {
        rollbar.error(
            'Failed to find `API_URL` env var! Aborting API request.'
        );

        return null;
    }

    const urlWithParams = listingsIds.reduce((acc, listingId) => {
        return `${acc}&listingId=${listingId}`;
    }, `${apiUrl}/listingsDetails?`);

    try {
        const {
            data: { data },
        } = await axios.get<OffieApiRes<ListingsDetailsRes>>(urlWithParams);

        return data;
    } catch (err) {
        rollbar.error(JSON.stringify(err));

        return null;
    }
};
