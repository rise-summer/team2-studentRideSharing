import React, { Component } from 'react';
import './App.css';
import DriverListing from './pages/DriverListing/DriverListing';
import Search from './pages/Search/Search';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import RideDetails from './pages/RideDetails/RideDetails';
import { createBrowserHistory } from 'history';
import LoginPage from './pages/LoginPage/LoginPage';
import Profile from './pages/Profile/Profile';

const history = createBrowserHistory();

function App() {
    return (
        <div className="App">
            <Router initialEntries={['/']} initialIndex={0} history={history}>
                <Switch>
                    <Route exact path="/">
                        <LoginPage />
                    </Route>
                    <Route path="/search">
                        <Search />
                    </Route>
                    <Route path="/ride">
                        <RideDetails />
                    </Route>
                    <Route path="/newride">
                        <DriverListing />
                    </Route>
                    <Route path="/login">
                        <LoginPage />
                    </Route>
                    <Route path="/profile">
                        <Profile userId="5f29a088bc6acb9e9da9e65e" />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
