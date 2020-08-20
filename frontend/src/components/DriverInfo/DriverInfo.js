import React from 'react';
import { Form, Icon, Button, Modal } from 'semantic-ui-react';
import { Link } from "react-router-dom";

import './DriverInfo.css';

class DriverInfo extends React.Component {
    constructor(props) {
        super(props);
        // console.log(props);
        this.state = {
            plate: '',
            make: '',
            model: '',
            color: '',
            capacity: 4,
            showModal: true,
        };
    }

    postFetch = () => {
        //TODO: get currentUserID, implement onAuthStateChange
        fetch(`/api/vehicles/${this.props.userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state)
        })
    }

    handleSubmit = async event => {
        event.preventDefault();

        try {
            console.log(this.state)
            this.postFetch();
            this.setState({
                plate: '',
                make: '',
                model: '',
                color: '',
            })

        } catch (error) {
            console.log(error);
        }
    }

    handleChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    closeModal = () => {
        this.setState({ showModal: false })
        
    }

    render() {
        const { plate, make, model, color, showModal} = this.state;
        return (
            <div>
                <Modal
                    closeIcon
                    size={'tiny'}
                    onClose={this.closeModal}
                    open={showModal}
                >
                    <Modal.Content >
                        <Form className='input-form' onSubmit={this.handleSubmit}>
                            <Icon classname='car-icon' name='car' size='huge' />
                            <br />
                            <br />
                            <Form.Input
                                name='plate'
                                value={plate}
                                onChange={this.handleChange}
                                label='Car License Plate'
                            />
                            <Form.Input
                                name='make'
                                value={make}
                                onChange={this.handleChange}
                                label='Car Make'
                            />
                            <Form.Input
                                name='model'
                                value={model}
                                onChange={this.handleChange}
                                label='Car Model'
                            />
                            <Form.Input
                                name='color'
                                value={color}
                                onChange={this.handleChange}
                                label='Car Color'
                            />
                            <Form.Button to='/newride' id="submit-button">Submit</Form.Button>
                        </Form>
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
}

export default DriverInfo;



{/* < div className="driver-info">
    <div id='close-icon'>
        <Button icon to='/search' as={Link}>
            <Icon link name='close' size='tiny' />
        </Button>
    </div>
</div > */}