import { Popover, Divider, Stack, PopoverProps } from '@mui/material';
import { ListingDetails } from '../../types/Offie';
import { InfoPopoverReviews } from './InfoPopoverReviews';
import { InfoPopoverItem } from './InfoPopoverItem';
import { InfoPopoverTitle } from './InfoPopoverTitle';
import InfoPopoverFooter from './InfoPopoverFooter';

export interface InfoPopoverProps {
    listingDetails: ListingDetails;
    onClose: () => void;
    anchorEl: HTMLElement | null;
}

export const getAnchorPosition = (
    anchorEl: HTMLElement | null
): PopoverProps['anchorPosition'] => {
    if (!anchorEl) {
        return undefined;
    }

    const rect = anchorEl.getBoundingClientRect();

    // Decrease y location by 10 to give padding from button anchor
    rect.y -= 10;

    return rect;
};

export const InfoPopover = ({
    listingDetails,
    onClose,
    anchorEl,
}: InfoPopoverProps): JSX.Element => {
    const open = !!anchorEl;

    return (
        <Popover
            PaperProps={{
                style: {
                    borderRadius: 12,
                    boxShadow: 'rgb(0 0 0 / 28%) 0px 8px 28px',
                },
            }}
            open={open}
            id={open ? 'simple-popover' : undefined}
            anchorReference="anchorPosition"
            anchorPosition={getAnchorPosition(anchorEl)}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <InfoPopoverTitle
                onClose={() => {
                    onClose();
                }}
            />

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

            <InfoPopoverFooter />
        </Popover>
    );
};
