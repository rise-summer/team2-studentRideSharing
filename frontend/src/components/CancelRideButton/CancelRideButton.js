import React from 'react';
import { Button, Modal, Icon } from 'semantic-ui-react';

const CancelRideButton = ({
    startName,
    destName,
    id,
    driverID,
    handleError,
}) => {
    const [open, setOpen] = React.useState(false);

    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);
    const button = (
        <Button size="tiny" 
        // basic 
        //color="red"
        style={{padding: "0", border: "none", background: "none"}}>
            <span style={{color: "#DB4848"}}>Cancel Ride</span>
        </Button>
    );

    const handleCancel = () => {
        fetch(`/api/rides/cancel/${driverID}/${id}`, { method: 'PUT' })
            .then((response) => response.text())
            .then((result) => handleError(result))
            .catch((error) => console.log('error', error));
    };

    const handleCancelButton = () => {
        setOpen(false);
        handleCancel();
    };

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
                <Button basic color="orange" onClick={handleClose}>Go Back</Button>
                <Button primary onClick={handleCancelButton}>
                    Cancel Ride
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default CancelRideButton;
