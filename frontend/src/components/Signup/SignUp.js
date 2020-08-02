import React from 'react';
import { Form, Divider, Button } from 'semantic-ui-react';

class Signup extends React.Component {
    //TODO: Add prefereed contact methods
    //Combine into one component (see figma layout)
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
        };
    }

    handleChange = (event, { name, value }) => {
        this.setState({ [name]: value });
    };
    handleSubmit = (event) => {
        alert('Submitted ' + JSON.stringify(this.state));
        this.setState({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
        });
    };
    render() {
        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            confirmPassword,
        } = this.state;
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Input
                        id="first-name"
                        name="firstName"
                        label="First Name"
                        value={firstName}
                        onChange={this.handleChange}
                        required
                    />
                    <Form.Input
                        id="last-name"
                        name="lastName"
                        label="Last Name"
                        value={lastName}
                        onChange={this.handleChange}
                        required
                    />
                    <Form.Input
                        id="email"
                        name="email"
                        label="Email"
                        value={email}
                        onChange={this.handleChange}
                        required
                    />
                    <Form.Input
                        id="phone-number"
                        name="phoneNumber"
                        label="Phone Number"
                        value={phoneNumber}
                        onChange={this.handleChange}
                        required
                    />
                    <Form.Input
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={this.handleChange}
                        required
                    />
                    <Form.Input
                        id="confirm-password"
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={this.handleChange}
                        required
                    />
                    <Form.Button
                        id="submit"
                        control={Button}
                        fluid
                        color="black"
                        content="Create an account"
                    />
                </Form>
                <Divider horizontal>Or</Divider>
                [Login with google button]
            </div>
        );
    }
}

export default Signup;
