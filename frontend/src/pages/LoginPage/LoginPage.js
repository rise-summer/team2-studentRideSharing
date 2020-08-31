import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { auth } from '../../firebase';
import SignIn from '../../components/Auth/SignIn';
import SignUp from '../../components/Auth/SignUp';
import { Grid, Tab, Container, Image } from 'semantic-ui-react';
import loginSplash from './loginSplash.png';

class LoginPage extends Component {
    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        if(typeof this.listener === "function"){
            this.listener();
        }
    }

    authAndRedirect = () => {
        this.listener = auth.onAuthStateChanged((data) => {
            if (data) { //logged in
                this.props.dispatch({
                    type: 'UPDATE_AUTH_STATUS',
                    loggedIn: true,
                    uid: data.uid,
                });
                //Prepare for redirect after login
                //reference: https://reactrouter.com/web/example/auth-workflow
                const { history, location } = this.props;
                let { from } = location.state || { from: { pathname: '/'} };
                history.replace(from);
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

    render() {
        const panes = [
            {
                menuItem: 'Log In',
                render: () => (
                    <Tab.Pane attached={false} textAlign="left">
                        <SignIn redirect={this.authAndRedirect}/>
                    </Tab.Pane>
                ),
            },
            {
                menuItem: 'Sign Up',
                render: () => (
                    <Tab.Pane attached={false} textAlign="left">
                        <SignUp redirect={this.authAndRedirect}/>
                    </Tab.Pane>
                ),
            },
        ];
        return (
             <Grid style={{ height: '100vh' }}>
            <Grid.Column
                width={7}
                style={{
                    background:
                        'linear-gradient(175.08deg, #FECF50 3.96%, #FFD401 50.75%)',
                }}
            >
                {/* <Image fluid src={loginSplash} /> */}
            </Grid.Column>
            <Grid.Column
                width={9}
                style={{
                    height: '100%',
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
                    style={{width: '50%'}}
                    panes={panes}
                    defaultActiveIndex={0}
                />
            </Grid.Column>
        </Grid>
        )
    }
}

export default connect()(withRouter(LoginPage));
