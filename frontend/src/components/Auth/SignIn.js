import React from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Divider, Button } from 'semantic-ui-react';
import firebase, { auth } from "../../firebase";
import { uiConfig } from "../../firebase";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loggedIn: false,
        };
    }

    handleChange = (event, {name, value}) => {
        this.setState({[name]: value});
    };

    handleSubmit = (event) => {
        // alert('Submitted ' + JSON.stringify(this.state));
        const {email, password} = this.state;
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({loggedIn: true});
            })
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/wrong-password') {
                    alert('Wrong password.');
                } else {
                    alert(errorMessage);
                }
                console.log(error);
            });
        this.setState({
            email: '',
            password: '',
        });
    };

    render() {
        if (this.state.loggedIn) {
            return <Redirect to="/searchlanding" />
        } else {
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
                    {/* Alternative login methods */}
                    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
                </div>
            );
        }
    }
}

export default SignIn;
