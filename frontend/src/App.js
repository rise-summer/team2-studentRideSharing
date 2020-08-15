import React, { Component } from 'react';
import './App.css';
import DriverListing from './pages/DriverListing/DriverListing';
import Search from './pages/Search/Search';
import RideDetails from './pages/RideDetails/RideDetails';
import LoginPage from './pages/LoginPage/LoginPage';
import Profile from './pages/Profile/Profile';
import Navbar from './components/Navbar/Navbar';
import { Router, Switch, Route, } from 'react-router-dom';
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
                    <Route path="/ride/:driverID/:rideID" component={RideDetails}/>
                    <Route path="/newride">
                        <DriverListing />
                    </Route>
                    <Route path="/login">
                        <LoginPage />
                    </Route>
                    <Route path="/profile">
                        <Profile userId="5f31c5e09320783304b40d4e" />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
