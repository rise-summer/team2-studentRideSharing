import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { auth } from "../../firebase";
import SignIn from '../../components/Auth/SignIn';
import SignUp from '../../components/Auth/SignUp';

import { Grid, Tab, Button } from 'semantic-ui-react';
import './LoginPage.css';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: '',
        };
    }

    componentDidMount() {
        this.listener = auth.onAuthStateChanged((data) => {
            if (data) { //logged in
                this.props.dispatch({
                    type: 'UPDATE_AUTH_STATUS',
                    loggedIn: true,
                    uid: data.uid,
                });
                this.redirect();
            }
            else {
                this.props.dispatch({
                    type: 'UPDATE_AUTH_STATUS',
                    loggedIn: false,
                    uid: "",
                })
            }
        });
    }

    componentWillUnmount() {
        this.listener();
    }

    redirect = () => {
        //Prepare for redirect after login
        //reference: https://reactrouter.com/web/example/auth-workflow
        const { history, location } = this.props;
        let { from } = location.state || { from: { pathname: "/"} };
        history.replace(from);
    }

    render() {
        const panes = [
            {
                menuItem: 'Log In',
                render: () => (
                    <Tab.Pane attached={false} textAlign="left">
                        <SignIn redirect={this.redirect}/>
                    </Tab.Pane>
                ),
            },
            {
                menuItem: 'Sign Up',
                render: () => (
                    <Tab.Pane attached={false} textAlign="left">
                        <SignUp redirect={this.redirect}/>
                    </Tab.Pane>
                ),
            },
        ];
        return (
            <Grid
                textAlign="center"
                style={{height: '100%'}}
                verticalAlign="middle"
            >
                <Grid.Column style={{maxWidth: 450}}>
                    <Tab
                        menu={{secondary: true, pointing: true}}
                        panes={panes}
                        defaultActiveIndex={0}
                    />
                </Grid.Column>
            </Grid>
        )
    }
}

export default connect()(withRouter(LoginPage));