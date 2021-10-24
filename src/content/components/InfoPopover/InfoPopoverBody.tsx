import { Divider, Stack } from '@mui/material';
import { InfoPopoverReviews } from './InfoPopoverReviews';
import { InfoPopoverItem } from './InfoPopoverItem';
import { ListingDetails } from '../../../types/Offie';

export interface InfoPopoverBodyProps {
    listingDetails: ListingDetails;
}

export const InfoPopoverBody = ({
    listingDetails,
}: InfoPopoverBodyProps): JSX.Element => {
    return (
        <div
            style={{
                padding: '12px 24px',
                borderBottom: '1px solid #ebebeb',
            }}
        >
            <Stack spacing={2}>
                <InfoPopoverItem
                    title="Wifi speed"
                    value={
                        listingDetails.wifiSpeed
                            ? `${listingDetails.wifiSpeed.toString()}mbps`
                            : null
                    }
                />

                <InfoPopoverItem
                    title="Dedicated workspace"
                    value={
                        listingDetails.workspaceAmenities
                            ? listingDetails.workspaceAmenities.toString()
                            : null
                    }
                />
            </Stack>

            <Divider style={{ margin: '12px 0px' }} />

            <InfoPopoverReviews
                reviews={listingDetails.wifiSentiment.reviews}
            />
        </div>
    );
};
