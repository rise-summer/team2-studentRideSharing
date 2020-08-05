import React from 'react';
import { Button, Modal, Icon } from 'semantic-ui-react';

const CancelRideButton = ({ startName, destName }) => {
    const [open, setOpen] = React.useState(false);

    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);
    const button = (
        <Button basic color="red">
            Cancel Ride
        </Button>
    );
    return (
        <Modal
            closeIcon
            size="tiny"
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            trigger={button}
        >
            <Modal.Content>
                Are you sure you want to cancel your {startName}
                <Icon name="arrow right" />
                {destName} ride?
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={handleClose}>Go Back</Button>
                <Button negative onClick={handleClose}>
                    Cancel Ride
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default CancelRideButton;
