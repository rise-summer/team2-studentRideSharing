import React from 'react';
import SignIn from '../../components/Auth/SignIn';
import SignUp from '../../components/Auth/SignUp';
import { Grid, Tab } from 'semantic-ui-react';
import './LoginPage.css';

const LoginPage = () => {
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
    );
};

export default LoginPage;
