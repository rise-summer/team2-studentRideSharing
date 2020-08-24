import React, { Component, useState, useEffect } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import DriverListing from './pages/DriverListing/DriverListing';
import Search from './pages/Search/Search';
import RideDetails from './pages/RideDetails/RideDetails';
import LoginPage from './pages/LoginPage/LoginPage';
import Profile from './pages/Profile/Profile';
import Navbar from './components/Navbar/Navbar';
import PrivateRoute from './components/Navigation/PrivateRoute';
import { auth } from "./firebase";
import './App.css';

const history = createBrowserHistory();

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            uid: ""
        }
    }

    componentWillMount() {
        this.listener = auth.onAuthStateChanged((data) => {
            if (data) { //logged in
                this.setState({
                    uid: data.uid,
                    isAuthenticated: true
                })
                // console.log("true: " + this.state.isAuthenticated);
            }
            else {
                this.setState({
                    uid: "",
                    isAuthenticated: false
                })
                // console.log("false: " + this.state.isAuthenticated);
            }
        });
    }

    componentWillUnmount() {
        this.listener();
    }

    // const [uid, setUid] = useState("");
    // const [isAuthenticated, setAuthStatus] = useState(false);

    // useEffect(() => {
    //     auth.onAuthStateChanged((data) => {
    //         if (data) { //logged in
    //             setUid(data.uid);
    //             setAuthStatus(true);
    //             console.log("true: " + isAuthenticated);
    //         }
    //         else {
    //             setUid("");
    //             setAuthStatus(false);
    //             console.log("false: " + isAuthenticated);
    //         }
    //     });
    // }, []);

    signOut = () => {
        auth.signOut().then(function() {
            // Sign-out successful.
            console.log("Sign-out successful.");
            this.setState({
                uid: "",
                isAuthenticated: false
            });
        }).catch(function(error) {
          // An error happened
          console.log("error occurred when signing out");
          console.log(error);
        });
    }

    login = () => {
        this.setState({
            isAuthenticated: true
        })
    }

    render() {
        const {isAuthenticated, uid} = this.state;
        console.log("before" + isAuthenticated);
        return (
            <div className="App">
            {/* <Router initialEntries={['/']} initialIndex={0} history={history}> */}
                <Router initialEntries={[]} initialIndex={0} history={history}>
                    <Navbar isAuthenticated={isAuthenticated} signOut={this.signOut} login={this.login}/>
                    <Switch>
                        <Route path="/search">
                            <Search />
                        </Route>
                        <Route path="/login">
                            <LoginPage login={this.login} />
                        </Route>
                        <PrivateRoute path="/ride/:driverID/:rideID" component={RideDetails} isAuthenticated={isAuthenticated}>
                        </PrivateRoute>
                        <PrivateRoute path="/profile"
                        isAuthenticated={isAuthenticated}>
                            <Profile />
                        </PrivateRoute>
                        <PrivateRoute path="/newride" isAuthenticated={isAuthenticated}>
                            <DriverListing userId="5f29a088bc6acb9e9da9e65e" />
                        </PrivateRoute>
                        <Route path="/">
                            <Search /> {/* should be search landing page */}
                        </Route>
                    </Switch>
                </Router>
            </div>
        );
    }
    // TODO: Add private routing and specific routing for user, ride
    // e.g. /user/5f29astecr0s965e
}

export default App;
