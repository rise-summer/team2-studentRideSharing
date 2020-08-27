import React from 'react';
import { Form, Button } from 'semantic-ui-react';
// import firebase, { auth, uiConfig } from '../../firebase';
import { auth } from '../../firebase';
// import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const querystring = require('querystring');

class SignUp extends React.Component {
    //TODO: Add preferred contact methods
    //Combine into one component (see figma layout)
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            confirmPassword: '',
            newUserCreated: false,
        };
    }

    handleChange = (event, { name, value }) => {
        this.setState({ [name]: value });
    };

    validate = () => {
        let errorMsg = '';
        const { email, password } = this.state;
        const reEmail = RegExp(
            '([a-zA-Z0-9_\\-.]+)@([a-zA-Z0-9_\\-.]+)\\.([a-zA-Z]{2,5})$'
        );
        const reEdu = RegExp('([a-zA-Z0-9_\\-.]+)@([a-zA-Z0-9_\\-.]+)\\.edu$');
        const validEmail = reEmail.test(email) && reEdu.test(email);
        if (!reEmail) {
            errorMsg += 'Invalid e-mail\n';
        }
        if (!reEdu) {
            errorMsg += 'Only *.edu e-mail addresses can be used\n';
        }
        const validPass = password.length >= 8;
        if (!validPass) {
            errorMsg += 'Password must be at least 8 characters long\n';
        }
        if (errorMsg) {
            alert(errorMsg);
        }

        return validEmail && validPass;
    };

    handleSubmit = (event) => {
        // alert('Submitted ' + JSON.stringify(this.state));
        // add regex checking and password match
        // pass all info to mongoDB too
        const { email, password } = this.state;
        if (this.validate()) {
            auth.createUserWithEmailAndPassword(email, password);
            this.setState({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                password: '',
                confirmPassword: '',
            });
        }
    };

    createUser = () => {
        const { email, password, confirmPassword } = this.state;
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        auth.createUserWithEmailAndPassword(email, password)
            .then(() => {
                console.log('New user created!');
                this.setState({ newUserCreate: true });
            })
            .catch(function (error) {
                alert(error.code + '\n' + error.message);
            });

        const newUserInfo = {
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            contact: { phone: this.state.phoneNumber },
            paymentMethods: ['Venmo', 'Cash', 'Zelle'],
            school: 'School University',
        };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUserInfo),
        };
        const xurl = '/api/users/signup';
        fetch(xurl, requestOptions)
            .then((response) => response.json())
            .then((data) => console.log(data));
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
                {/* TODO: setup redirect after new user created */}
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
                        label="Student Email"
                        type="Email"
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
                        primary
                        id="submit"
                        fluid
                        content="Create an account"
                        onClick={this.createUser}
                    />
                </Form>
                {/*<Divider horizontal>Or</Divider>*/}
                {/*[Login with google button]*/}
                {/*<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />*/}
            </div>
        );
    }
}

export default SignUp;
