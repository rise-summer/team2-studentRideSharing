import React from 'react';
import { Button, Modal, Icon } from 'semantic-ui-react';

const CancelRideButton = ({ startName, destName, id, handleCancel }) => {
    const [open, setOpen] = React.useState(false);

    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);
    const handleCancelButton = () => {
        setOpen(false);
        handleCancel(id);
    };
    const button = (
        <Button size="tiny" basic color="red">
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
                <Button negative onClick={handleCancelButton}>
                    Cancel Ride
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default CancelRideButton;
