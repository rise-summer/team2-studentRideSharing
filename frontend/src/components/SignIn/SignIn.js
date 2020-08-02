import React from 'react';
import { Form, Divider, Button } from 'semantic-ui-react';

class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
    }

    handleChange = (event, { name, value }) => {
        this.setState({ [name]: value });
    };
    handleSubmit = (event) => {
        alert('Submitted ' + JSON.stringify(this.state));
        this.setState({
            email: '',
            password: '',
        });
    };
    render() {
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Input
                        id="email"
                        name="email"
                        label="Email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        required
                    />
                    <Form.Input
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        required
                    />
                    <Form.Button
                        id="submit"
                        control={Button}
                        fluid
                        color="black"
                        content="Log In"
                    />
                </Form>
                <Divider horizontal>Or</Divider>
                [Login with google button]
            </div>
        );
    }
}

export default Signin;
