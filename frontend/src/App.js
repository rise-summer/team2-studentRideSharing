import React, { Component } from 'react';
import './App.css';
import DriverListing from './pages/DriverListing/DriverListing';
import Search from './pages/Search/Search';
import RideDetails from './pages/RideDetails/RideDetails';
import LoginPage from './pages/LoginPage/LoginPage';
import Profile from './pages/Profile/Profile';
import DriverInfo from './pages/DriverInfo/DriverInfo';
import Navbar from './components/Navbar/Navbar';
import SearchLanding from './components/SearchComponents/SearchLanding';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

function App() {
    // TODO: Add private routing and specific routing for user, ride
    // e.g. /user/5f29astecr0s965e
    return (
        <div className="App">
            <Router initialEntries={['/']} initialIndex={0} history={history}>
                <Navbar isLoggedIn={true} />
                <Switch>
                    {/* should be search if user logged in */}
                    <Route exact path="/">
                        <LoginPage />
                    </Route>
                    <Route path="/search">
                        <Search />
                    </Route>
                    <Route path="/ride/:driverID/:rideID" component={RideDetails} />
                    <Route path="/newride">
                        <DriverListing />
                    </Route>
                    <Route path="/login">
                        <LoginPage />
                    </Route>
                    <Route path="/profile">
                        <Profile userId="5f29a088bc6acb9e9da9e65e" />
                    </Route>
                    <Route path="/vehicleinfo">
                        <DriverInfo />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
