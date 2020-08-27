import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Segment, Menu, Icon, Button } from 'semantic-ui-react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from "../../firebase";
import Auth from '../../components/Auth/Auth';

const Navbar = ({isAuthenticated, signOut, login}) => {
    //TODO: add mobile layout
    /* TODO: Fix routing https://stackoverflow.com/questions/55105402/react-router-click-same-link-more-than-one-times-and-browser-back-button*/

    const { pathname } = useLocation();
    // const [isAuthenticated, setAuthStatus] = useState(false);
    //
    // useEffect(() => {
    //     auth.onAuthStateChanged((data) => {
    //         if (data) { //logged in
    //             setAuthStatus(true);
    //             Auth.authenticate(data.uid);
    //         } else {
    //             setAuthStatus(false);
    //             Auth.signOut();
    //         }
    //     });
    // });

    // const signOut = () => {
    //     auth.signOut().then(function() {
    //         // Sign-out successful.
    //         setAuthStatus(false);
    //         Auth.signOut();
    //     }).catch(function(error) {
    //         // An error happened
    //         console.log("error occurred when signing out");
    //         console.log(error);
    //     });
    // };

    return (
        <Segment vertical inverted>
            {isAuthenticated ? (
                <Menu inverted secondary pointing size="large">
                    <Link to="/search">
                        <Menu.Item active={pathname === '/search'}>
                            Search
                        </Menu.Item>
                    </Link>
                    <Link to="/newride">
                        <Menu.Item active={pathname === '/newride'}>
                            Create a Ride
                        </Menu.Item>
                    </Link>
                    <Link to="/profile">
                        <Menu.Item active={pathname === '/profile'}>
                            Profile <Icon name="user circle outline" />
                        </Menu.Item>
                    </Link>
                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Button onClick={signOut}>Log Out</Button>
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
            ) : (
                <Menu inverted secondary pointing size="large">
                    <Link to="/search">
                        <Menu.Item active={pathname === '/search'}>
                            Search
                        </Menu.Item>
                    </Link>
                    <Menu.Menu position='right'>
                        <Link to="/login">
                            <Menu.Item active={pathname === '/login'}>
                                Login / Sign Up
                            </Menu.Item>
                        </Link>
                                                <Menu.Item>
                                                    <Button onClick={login}>login</Button>
                                                </Menu.Item>

                    </Menu.Menu>
                </Menu>
            )}
        </Segment>
    );
};

export default Navbar;
