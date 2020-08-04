import React from 'react';
import ProfileTabs from '../../components/ProfileTabs/ProfileTabs';
import { Grid, Header, Image } from 'semantic-ui-react';

const Profile = () => {
    return (
        <div>
            <Grid
                textAlign="center"
                style={{ height: '100vh' }}
                verticalAlign="middle"
            >
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h1">
                        Jane Doe
                        <Header.Subheader>UC Los Angeles</Header.Subheader>
                    </Header>
                    <ProfileTabs />
                </Grid.Column>
            </Grid>
        </div>
    );
};

export default Profile;
