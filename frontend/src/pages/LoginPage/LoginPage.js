import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { auth } from '../../firebase';
import SignIn from '../../components/Auth/SignIn';
import SignUp from '../../components/Auth/SignUp';
import { Grid, Tab, Image } from 'semantic-ui-react';
import './LoginPage.css';
import loginSplash from './loginSplash.png';
import signupSplash from './signupSplash.png';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = { activeIndex: 0 };
    }
    handleTabChange = (e, { activeIndex }) => this.setState({ activeIndex });
    componentWillUnmount() {
        if (typeof this.listener === 'function') {
            this.listener();
        }
    }

    authAndRedirect = () => {
        this.listener = auth.onAuthStateChanged((data) => {
            if (data) {
                //logged in
                this.props.dispatch({
                    type: 'UPDATE_AUTH_STATUS',
                    loggedIn: true,
                    uid: data.uid,
                });
                //Prepare for redirect after login
                //reference: https://reactrouter.com/web/example/auth-workflow
                const { history, location } = this.props;
                let { from } = location.state || { from: { pathname: '/' } };
                history.replace(from);
            } else {
                this.props.dispatch({
                    type: 'UPDATE_AUTH_STATUS',
                    loggedIn: false,
                    uid: '',
                });
            }
        });
    };

    render() {
        const panes = [
            {
                menuItem: 'Log In',
                render: () => <SignIn redirect={this.authAndRedirect} />,
            },
            {
                menuItem: 'Sign Up',
                render: () => <SignUp redirect={this.authAndRedirect} />,
            },
        ];
        const { activeIndex } = this.state;
        const backgroundStyle =
            activeIndex === 0
                ? 'linear-gradient(175.08deg, #FECF50 3.96%, #FFD401 50.75%)'
                : `url(${signupSplash})`;

        return (
            <Grid className="mainGrid">
                <Grid.Column
                    className="splashColumn"
                    width={7}
                    style={{
                        background: backgroundStyle,
                    }}
                >
                    {activeIndex === 0 && (
                        <Image className="splashImage" src={loginSplash} />
                    )}
                </Grid.Column>
                <Grid.Column
                    width={9}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'top',
                        paddingTop: '10em',
                    }}
                >
                    <Tab
                        menu={{
                            fluid: true,
                            widths: 2,
                            secondary: true,
                            pointing: true,
                        }}
                        style={{ width: '50%' }}
                        panes={panes}
                        activeIndex={activeIndex}
                        onTabChange={this.handleTabChange}
                    />
                </Grid.Column>
            </Grid>
        );
    }
}

export default connect()(withRouter(LoginPage));
