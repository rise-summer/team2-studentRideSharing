import React from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import login_image from './google-login.png';


/* TODO: 
-model layout after mockup

*/

class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
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
                <h1>Log in</h1>
                <form onSubmit={this.handleSubmit} autoComplete="off">
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
                    <input type="submit" value="Sign In" />
                    <br />
                    Don't have an account? <a href="#">Sign up</a>
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

export default Signin;
