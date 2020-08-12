import React from 'react';
import ProfileDetails from './ProfileDetails';
import ProfileListings from './ProfileListings';
import { Tab, Menu, Label } from 'semantic-ui-react';

const ProfileTabs = ({ vehicles, contact, email, rides, handleCancel }) => {
    const panes = [
        {
            menuItem: (
                <Menu.Item>
                    My Listings
                    <Label circular size="mini" color="black">
                        {rides.filter((ride) => !ride.status || ride.status === 0).length}
                    </Label>
                </Menu.Item>
            ),
            render: () =>
                <Tab.Pane attached={false} >
                    <ProfileListings rides={rides} handleCancel={handleCancel} />
                </Tab.Pane>
            ,
        },
        {
            menuItem: 'My Requests',
            render: () => (
                <Tab.Pane attached={false}>
                    TODO: Implement 'My Request' Tab
                    This is a placeholder.
                    This tab should display all requests belongs to the current user.
                    Go to ProfileTabs.js to editing this placeholder.
                </Tab.Pane>
            ),
        },
        {
            menuItem: 'My Profile',
            render: () => (
                <Tab.Pane attached={false}>
                    <ProfileDetails vehicles={vehicles} contact={contact} email={email} />
                </Tab.Pane>
            ),
        },
    ];

    return (
        <div>
            <Tab
                menu={{
                    fluid: true,
                    widths: 4,
                    secondary: true,
                    pointing: true,
                }}
                panes={panes}
                defaultActiveIndex={0}
            />
        </div>
    );
};

export default ProfileTabs;
