import { Popover, PopoverProps } from '@mui/material';
import { ListingDetails } from '../../../types/Offie';
import { InfoPopoverBody } from './InfoPopoverBody';
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

    // Padding from button anchor
    rect.y -= 10;

    return rect;
};

export const InfoPopover = ({
    listingDetails,
    onClose,
    anchorEl,
}: InfoPopoverProps): JSX.Element => {
    const open = !!anchorEl;

    const handleClose = () => {
        onClose();
    };

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
            <InfoPopoverTitle onClose={handleClose} />
            <InfoPopoverBody listingDetails={listingDetails} />
            <InfoPopoverFooter />
        </Popover>
    );
};
