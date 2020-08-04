import React from 'react';
import Signin from '../../components/Signin/Signin';
import Signup from '../../components/Signup/Signup';
import { Grid, Tab } from 'semantic-ui-react';

const LoginPage = () => {
    const panes = [
        {
            menuItem: 'Log In',
            render: () => (
                <Tab.Pane attached={false} textAlign="left">
                    <Signin />
                </Tab.Pane>
            ),
        },
        {
            menuItem: 'Sign Up',
            render: () => (
                <Tab.Pane attached={false} textAlign="left">
                    <Signup />
                </Tab.Pane>
            ),
        },
    ];
    return (
        <div>
            <Grid
                textAlign="center"
                style={{ height: '100vh' }}
                verticalAlign="middle"
            >
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Tab
                        menu={{ secondary: true, pointing: true }}
                        panes={panes}
                        defaultActiveIndex={0}
                    />
                </Grid.Column>
            </Grid>
        </div>
    );
};

export default LoginPage;
