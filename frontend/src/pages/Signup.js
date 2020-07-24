import React from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import login_image from './google-login.png';

class Signup extends React.Component {
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
        this.setState({ [name]: value });
    };
    handleSubmit = (event) => {
        event.preventDefault();
        alert('Submitted ' + JSON.stringify(this.state));
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
                    <input type="submit" value="Sign up" />
                    <br />
                    Already have an account? <a href="#">Sign in</a>
                </form>
                <a href="#">
                    {/* Placeholder */}
                    <img
                        src={login_image}
                        style={{ 'margin-top': 50, width: 250, height: 'auto' }}
                    />
                </a>
            </div>
        );
    }
}

export default Signup;
