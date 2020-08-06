import React from 'react';
import { Segment, Menu, Icon } from 'semantic-ui-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ isLoggedIn }) => {
    //TODO: add mobile layout
    /* TODO: Fix routing https://stackoverflow.com/questions/55105402/react-router-click-same-link-more-than-one-times-and-browser-back-button*/
    const { pathname } = useLocation();
    return (
        <Segment vertical inverted>
            {isLoggedIn ? (
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
                </Menu>
            ) : (
                <Menu inverted secondary pointing size="large">
                    <Link to="/search">
                        <Menu.Item active={pathname === '/search'}>
                            Search
                        </Menu.Item>
                    </Link>
                    <Link to="/login">
                        <Menu.Item active={pathname === '/login'}>
                            Login / Sign Up
                        </Menu.Item>
                    </Link>
                </Menu>
            )}
        </Segment>
    );
};

export default Navbar;
