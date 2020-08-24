import React, { Component, useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { auth } from "../../firebase";
// import Auth from '../../components/Auth/Auth';

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
// function PrivateRoute({ children, isAuthenticated, ...rest }) {
class PrivateRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            uid: ""
        }
    }

    // componentWillMount() {
    //     this.listener = auth.onAuthStateChanged((data) => {
    //         if (data) { //logged in
    //             this.setState({
    //                 uid: data.uid,
    //                 isAuthenticated: true
    //             })
    //             console.log("true: " + this.state.isAuthenticated);
    //         }
    //         else {
    //             this.setState({
    //                 uid: "",
    //                 isAuthenticated: false
    //             })
    //             console.log("false: " + this.state.isAuthenticated);
    //         }
    //     });
    // }
    //
    // componentWillUnmount() {
    //     this.listener();
    // }
    //
    // shouldComponentUpdate(nextProps, nextState) {
    //     return this.props.value != nextProps.value;
    // }

    render() {
        const {isAuthenticated, children, ...rest} = this.props;
        // const {isAuthenticated} = this.state;
        return (
            <Route
                {...rest}
                render={({ location }) =>
                    isAuthenticated ? (
                        children
                    ) : (
                        <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                        />
                    )
                }
            />
        );
    }
}

export default PrivateRoute;