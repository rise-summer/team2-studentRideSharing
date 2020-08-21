import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { auth } from "../../firebase";
import SignIn from '../../components/Auth/SignIn';
import SignUp from '../../components/Auth/SignUp';
import { Grid, Tab } from 'semantic-ui-react';
import './LoginPage.css';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: '',
        };
    }

    componentDidMount() {
        auth.onAuthStateChanged((data) => {
            if (data) { //logged in
                this.setState({uid: data.uid});
            }
        });
    }

    render() {
        const panes = [
            {
                menuItem: 'Log In',
                render: () => (
                    <Tab.Pane attached={false} textAlign="left">
                        <SignIn />
                    </Tab.Pane>
                ),
            },
            {
                menuItem: 'Sign Up',
                render: () => (
                    <Tab.Pane attached={false} textAlign="left">
                        <SignUp />
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

export default LoginPage;
