import React from 'react';
import { Form, Icon, Button, Modal } from 'semantic-ui-react';
import { Link } from "react-router-dom";

import './DriverInfo.css';

class DriverInfo extends React.Component {
    constructor() {
        super();

        this.state = {
            plate: '',
            make: '',
            model: '',
            color: '',
            capacity: 4,
        };
    }

    postFetch = () => {
        const userId = '5f2f0fdb12db250479914d5b';  //TODO: get currentUserID, implement onAuthStateChange
        fetch(`/api/vehicles/${userId}`, {
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

    render() {
        const { plate, make, model, color } = this.state;
        return (
            <div>
                <Modal
                    closeIcon
                    size={'tiny'}
                    trigger={<Button>Show Modal</Button>}
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
                            <Form.Button id="submit-button">Submit</Form.Button>
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