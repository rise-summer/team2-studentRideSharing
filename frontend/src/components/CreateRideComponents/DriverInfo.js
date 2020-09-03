import React from 'react';
import { Form, Icon, Button, Modal, Message } from 'semantic-ui-react';

import './DriverInfo.css';

class DriverInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            plate: '',
            make: '',
            model: '',
            color: '',
            capacity: 4,
            showModal: true,
            submitted: false,
            success: '',
            error: '',
        };
    }

    //POST request to create new vehicle infomation
    postFetch = () => {
        fetch(`/api/vehicles/${this.props.userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state)
        }).then(response => {
            if(response.status === 201){
                this.setState({
                    submitted: true,
                    success: 'true',
                });
            } 
            else {
                this.setState({
                    error: 'true',
                })
            }
        })
    }

    handleSubmit = async event => {
        event.preventDefault();

        try {
            this.postFetch();
            this.setState({
                plate: '',
                make: '',
                model: '',
                color: '',
                submitted: false,
            });

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
        this.props.changeCarInfo(this.state.submitted);
    }

    render() {
        const { plate, make, model, color, showModal, success, error } = this.state;
        return (
            <div>
                <Modal 
                    closeIcon
                    size="tiny"
                    onClose={this.closeModal}
                    open={showModal}
                >
                    <Modal.Content >
                        <Form className="input-form" onSubmit={this.handleSubmit} success={success} error={error}>
                            <Icon classname="car-icon" name="car" size="huge" />
                            <br />
                            <br />
                            <Form.Input
                                name="plate"
                                value={plate}
                                onChange={this.handleChange}
                                label="Car License Plate"
                                required
                            />
                            <Form.Input
                                name="make"
                                value={make}
                                onChange={this.handleChange}
                                label="Car Make"
                                required
                            />
                            <Form.Input
                                name="model"
                                value={model}
                                onChange={this.handleChange}
                                label="Car Model"
                                required
                            />
                            <Form.Input
                                name="color"
                                value={color}
                                onChange={this.handleChange}
                                label="Car Color"
                            />
                            <Form.Button to="/newride" type="submit">Submit</Form.Button>
                            <Message
                                success
                                header="Car Information Recorded!"
                                content="You're all set to create rides"
                            />
                        </Form>
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
}

export default DriverInfo;
