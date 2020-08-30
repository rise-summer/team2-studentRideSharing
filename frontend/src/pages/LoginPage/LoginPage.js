import React from 'react';
import SignIn from '../../components/Auth/SignIn';
import SignUp from '../../components/Auth/SignUp';
import { Grid, Tab, Container, Image } from 'semantic-ui-react';
import loginSplash from './loginSplash.png';

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
    );
};

export default LoginPage;
