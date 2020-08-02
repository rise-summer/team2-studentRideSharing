import React from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import google from './google-login.png';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from '../firebase'
import {uiConfig} from '../firebase';


class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        };
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value});
    };
    handleSubmit = (event) => {
        event.preventDefault();
        alert('Submitted ' + JSON.stringify(this.state));
        /* POST user signup info here */
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .catch(function(error) {
                console.log(error.code + ": " + error.message);
            });
    };

    render() {
        return (
            <div>
                <h1>Sign up</h1>
                <form onSubmit={this.handleSubmit} autoComplete="off">
                    <SearchBar
                        text={this.state.firstName}
                        editfn={this.handleChange}
                        placeholder="First name"
                        name="firstName"
                    />
                    <SearchBar
                        text={this.state.lastName}
                        editfn={this.handleChange}
                        placeholder="Last name"
                        name="lastName"
                    />
                    <SearchBar
                        text={this.state.email}
                        editfn={this.handleChange}
                        placeholder="Email"
                        name="email"
                    />
                    {/* TODO: Refactor into component? */}
                    <div className="inputwrapper">
                        <input
                            className="inputbox"
                            type="password"
                            onChange={this.handleChange}
                            placeholder="Password"
                        />
                    </div>
                    <input type="submit" value="Sign up"/>
                    <br/>
                    Already have an account? <a href="#">Sign in</a>
                </form>
                <a href="#">
                    {/* Placeholder */}
                    <img
                        alt=""
                        src={google}
                        style={{'margin-top': 50, width: 250, height: 'auto'}}
                    />
                </a>
            </div>
        );
    }
}
export default SignUp;
