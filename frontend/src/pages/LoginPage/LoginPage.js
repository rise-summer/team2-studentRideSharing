import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from "react-router";

import { connect } from "react-redux";
import { auth } from "../../firebase";
import SignIn from '../../components/Auth/SignIn';
import SignUp from '../../components/Auth/SignUp';
import Auth from '../../components/Auth/Auth';

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
        // auth.onAuthStateChanged((data) => {
        //     if (data) { //logged in
        //         Auth.authenticate(data.uid);
        //         this.setState({uid: data.uid});
        //     }
        // });
    }

    login = () => {
        //Prepare for redirect after login
        //reference: https://reactrouter.com/web/example/auth-workflow
        const { history, location } = this.props;
        let { from } = location.state || { from: { pathname: "/"} };
        console.log("from:");
        console.log(from);
        this.props.login();
        history.replace(from);
        console.log("here");
    }

    render() {
        const panes = [
            {
                menuItem: 'Log In',
                render: () => (
                    <Tab.Pane attached={false} textAlign="left">
                        <SignIn login={this.login}/>
                    </Tab.Pane>
                ),
            },
            {
                menuItem: 'Sign Up',
                render: () => (
                    <Tab.Pane attached={false} textAlign="left">
                        <SignUp login={this.login}/>
                    </Tab.Pane>
                ),
            },
        ];
        if(true) {
        // if(this.state.uid === '') {
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
        // return null;
        // else {
        //     return <Redirect to="/profile" />
        // }
    }
}

export default withRouter(LoginPage);
