import React from 'react';
import ProfileDetails from '../ProfileDetails/ProfileDetails';
import ProfileListings from '../ProfileListings/ProfileListings';
import { Tab, Menu, Label } from 'semantic-ui-react';

const ProfileTabs = () => {
    const panes = [
        {
            menuItem: 'Details',
            render: () => (
                <Tab.Pane attached={false} textAlign="left">
                    <ProfileDetails />
                </Tab.Pane>
            ),
        },
        {
            menuItem: (
                <Menu.Item>
                    My Listings
                    <Label circular size="mini" color="black">
                        2
                    </Label>
                </Menu.Item>
            ),
            render: () => (
                <Tab.Pane attached={false} textAlign="left">
                    <ProfileListings />
                </Tab.Pane>
            ),
        },
    ];

    return (
        <div>
            <Tab
                menu={{
                    fluid: true,
                    widths: 2,
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
