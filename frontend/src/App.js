import React, { Component } from 'react';
import './App.css';
import DriverListing from './pages/DriverListing/DriverListing';
import Search from './pages/Search/Search';
import LoginPage from './pages/LoginPage/LoginPage';
import Profile from './pages/Profile/Profile';

class App extends Component {
    constructor() {
        super();
        this.state = {
            userId: '5f29a088bc6acb9e9da9e65e',
        };
    }
    render() {
        return (
            <div className="App">
                <Profile userId={this.state.userId} />
            </div>
        );
    }
}

export default App;
