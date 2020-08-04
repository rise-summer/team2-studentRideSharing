import React from 'react';
import {Form, Divider, Button} from 'semantic-ui-react';
import firebase, {auth, uiConfig} from '../../firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';


class SignUp extends React.Component {
    //TODO: Add preferred contact methods
    //Combine into one component (see figma layout)
    constructor(props) {
        super(props);
        this.state = {
            firstName: 'Alex',
            lastName: 'Dinh',
            email: '',
            phoneNumber: '0',
            password: '',
            confirmPassword: '',
        };
    }

    handleChange = (event, {name, value}) => {
        this.setState({[name]: value});
    };

    validate = () => {
        let errorMsg = '';
        const {email, password} = this.state;
        const reEmail = RegExp('([a-zA-Z0-9_\\-.]+)@([a-zA-Z0-9_\\-.]+)\\.([a-zA-Z]{2,5})$');
        const reEdu = RegExp('([a-zA-Z0-9_\\-.]+)@([a-zA-Z0-9_\\-.]+)\\.edu$');
        const validEmail = reEmail.test(email) && reEdu.test(email);
        if (!reEmail) {
            errorMsg += 'Invalid e-mail\n';
        }
        if (!reEdu) {
            errorMsg += 'Only *.edu e-mail addresses can be used\n';
        }
        const validPass = (password.length >= 8);
        if (!validPass) {
            errorMsg += 'Password must be at least 8 characters long\n'
        }
        if (errorMsg) { alert(errorMsg); }

        return validEmail && validPass;
    };


    handleSubmit = (event) => {
        // alert('Submitted ' + JSON.stringify(this.state));
        // add regex checking and password match
        // pass all info to mongoDB too
        const {email, password} = this.state;
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
        } else {
        }
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
                {/*[Login with google button]*/}
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
            </div>
        );
    }
}

export default SignUp;
