import React, { Component } from 'react';
import './App.css';
import { Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { createBrowserHistory } from 'history';
import CreateRide from './pages/CreateRide/CreateRide';
import Search from './pages/Search/Search';
import RideDetails from './pages/RideDetails/RideDetails';
import LoginPage from './pages/LoginPage/LoginPage';
import Profile from './pages/Profile/Profile';
import Navbar from './components/Navbar/Navbar';
import PrivateRoute from './components/Navigation/PrivateRoute';
import { auth } from './firebase';
import './App.css';
import ThemingLayout from './pages/Theme/Theme';

const history = createBrowserHistory();

class App extends Component {
    componentDidMount() {
        this.listener = auth.onAuthStateChanged((data) => {
            if (data) { //logged in
                this.props.dispatch({
                    type: 'UPDATE_AUTH_STATUS',
                    loggedIn: true,
                    uid: data.uid,
                })
            }
            else {
                this.props.dispatch({
                    type: 'UPDATE_AUTH_STATUS',
                    loggedIn: false,
                    uid: '',
                })
            }
        });
    }

    componentWillUnmount() {
        this.listener();
    }

    render() {
        const { uid } = this.props;
        return (
            <div className="App">
            {/* <Router initialEntries={['/']} initialIndex={0} history={history}> */}
                <Router initialEntries={[]} initialIndex={0} history={history}>
                    <Navbar />
                    <Switch>
                        <Route path="/search">
                            <Search />
                        </Route>
                        <Route path="/login">
                            <LoginPage />
                        </Route>
                        <PrivateRoute path="/ride/:driverID/:rideID">
                            <RideDetails uid={uid} />
                        </PrivateRoute>
                        <PrivateRoute path="/profile">
                            <Profile />
                        </PrivateRoute>
                        <PrivateRoute path="/newride">
                            <CreateRide />
                        </PrivateRoute>
                        <Route path="/theme">
                            <ThemingLayout />
                        </Route>
                        <Route path="/">
                            <Search /> {/* should be search landing page */}
                        </Route>
                    </Switch>
                </Router>
            </div>
        );
    }
    // TODO: Add private routing and specific routing for user
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
