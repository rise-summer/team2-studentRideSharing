import React from 'react';
import SignIn from '../../components/SignIn/SignIn';
import SignUp from '../../components/Signup/SignUp';
import {Grid, Tab} from 'semantic-ui-react';

const LoginPage = () => {
    const panes = [
        {
            menuItem: 'Log In',
            render: () => (
                <Tab.Pane attached={false} textAlign="left">
                    <SignIn/>
                </Tab.Pane>
            ),
        },
        {
            menuItem: 'Sign Up',
            render: () => (
                <Tab.Pane attached={false} textAlign="left">
                    <SignUp/>
                </Tab.Pane>
            ),
        },
    ];
    return (
        <div>
            <Grid
                textAlign="center"
                style={{height: '100vh'}}
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
        </div>
    );
};

export default LoginPage;
