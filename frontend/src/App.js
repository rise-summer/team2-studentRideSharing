import React, { Component, useState, useEffect } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createBrowserHistory } from 'history';
import CreateRide from './pages/CreateRide/CreateRide';
import Search from './pages/Search/Search';
import RideDetails from './pages/RideDetails/RideDetails';
import LoginPage from './pages/LoginPage/LoginPage';
import Profile from './pages/Profile/Profile';
import Navbar from './components/Navbar/Navbar';
import PrivateRoute from './components/Navigation/PrivateRoute';
import SearchLanding from './components/SearchComponents/SearchLanding';
import { auth } from "./firebase";
import './App.css';
import { store } from './index';

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
                });
                this.props.dispatch({
                    type: 'UPDATE_AUTH_STATUS',
                    loggedIn: true,
                    uid: data.uid,
                })

                // console.log("true: " + this.state.isAuthenticated);
            }
            else {
                this.setState({
                    uid: "",
                    isAuthenticated: false
                });
                this.props.dispatch({
                    type: 'UPDATE_AUTH_STATUS',
                    loggedIn: true,
                    uid: "",
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
                            <CreateRide userId="5f29a088bc6acb9e9da9e65e" />
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

/* makes info from redux store available as prop for this component
*   - loggedIn: accessible via this.props.loggedIn
*   - uid: accessible via this.props.uid
* */
const mapStateToProps = (state) => ({
    loggedIn: state.loggedIn,
    uid: state.uid,
    query: state.query,
    rides: state.rides,
    searched: state.searched,
    roundtrip: state.roundtrip,
});

export default connect(mapStateToProps)(App);
