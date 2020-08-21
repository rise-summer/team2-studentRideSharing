import React, { useState, useEffect } from 'react';
import './App.css';
import DriverListing from './pages/DriverListing/DriverListing';
import Search from './pages/Search/Search';
import RideDetails from './pages/RideDetails/RideDetails';
import LoginPage from './pages/LoginPage/LoginPage';
import Profile from './pages/Profile/Profile';
import Navbar from './components/Navbar/Navbar';
import { Router, Switch, Route, } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { auth } from "./firebase";

const history = createBrowserHistory();

function App() {
    const [uid, setUid] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        auth.onAuthStateChanged((data) => {
            if (data) { //logged in
                setUid(data.uid);
                setIsLoggedIn(true);
            }
            else {
                setUid("");
                setIsLoggedIn(false);
            }
        });
    }, []);

    const signOut = () => {
        auth.signOut().then(function() {
            // Sign-out successful.
            console.log("Sign-out successful.");
            setIsLoggedIn(false);
        }).catch(function(error) {
          // An error happened
          console.log("error occurred when signing out");
          console.log(error);
        });
    }

    // TODO: Add private routing and specific routing for user, ride
    // e.g. /user/5f29astecr0s965e
    return (
        <div className="App">
            <Router initialEntries={['/']} initialIndex={0} history={history}>
                <Navbar isLoggedIn={isLoggedIn} signOut={signOut} />
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
                        <Profile userId="5f29a088bc6acb9e9da9e65e" />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
