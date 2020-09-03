import React from 'react';
import { connect } from 'react-redux';
import { Segment, Menu, Icon, Button, Sticky, Dropdown } from 'semantic-ui-react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../../firebase';
import './Navbar.css';
/* makes info from redux store available as prop for this component
*   - loggedIn: accessible via this.props.loggedIn
*   - uid: accessible via this.props.uid
* */
const mapStateToProps = (state) => ({
    loggedIn: state.loggedIn,
    // uid: state.uid,
});

const Navbar = (props) => {
    //TODO: add mobile layout
    /* TODO: Fix routing https://stackoverflow.com/questions/55105402/react-router-click-same-link-more-than-one-times-and-browser-back-button*/

    const { pathname } = useLocation();

    const signOut = () => {
        auth.signOut().then(function() {
            // Sign-out successful.
            console.log("Sign-out successful.");
            props.dispatch({
                type: 'UPDATE_AUTH_STATUS',
                loggedIn: false,
                uid: "",
            });
        }).catch(function(error) {
          // An error happened
          console.log("error occurred when signing out");
          console.log(error);
        });
    };

    return (
        <Segment vertical className='noBorderBottom'>
            {props.loggedIn ? (
                <Menu text secondary pointing size="large" className='noBorderBottom'>
                    <Link to="/search">
                        <Menu.Item active={pathname === '/search'}>
                            <h3 className='brand'>CRUZE</h3>
                        </Menu.Item>
                    </Link>
                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Link to="/newride">
                                <Button className='createRideBtn'>Create a Ride</Button>
                            </Link>
                        </Menu.Item>
                        <Menu.Item>
                            <Dropdown item text='Profile' icon='user circle outline'>
                                <Dropdown.Menu>
                                    <Dropdown.Item>
                                        <Link to="/profile">
                                            My Account
                                        </Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={signOut}>
                                        Log Out
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
            ) : (
                <Menu text secondary pointing size="large" className='noBorderBottom'>
                    <Link to="/search">
                        <Menu.Item active={pathname === '/search'}>
                            <h3 className='brand'>CRUZE</h3>
                        </Menu.Item>
                    </Link>
                    <Menu.Menu position='right'>
                        <Link to="/login">
                            <Menu.Item active={pathname === '/login'}>
                                Login / Sign Up
                            </Menu.Item>
                        </Link>
                    </Menu.Menu>
                </Menu>
            )}
        </Segment>
    );
};

export default connect(mapStateToProps)(Navbar);
