import React from 'react';
import ProfileDetails from './ProfileDetails';
import ProfileListings from './ProfileListings';
import { Tab, Menu, Label } from 'semantic-ui-react';

const ProfileTabs = ({ vehicles, contact, email, rides, handleCancel }) => {
    const panes = [
        {
            menuItem: 'Details',
            render: () => (
                <Tab.Pane attached={false} textAlign="left">
                    <ProfileDetails vehicles={vehicles} contact={contact} email={email} />
                </Tab.Pane>
            ),
        },
        {
            menuItem: (
                <Menu.Item>
                    My Listings
                    <Label circular size="mini" color="black">
                        {rides.filter((ride) => !ride.status || ride.status === 0).length}
                    </Label>
                </Menu.Item>
            ),
            render: () => (
                <Tab.Pane attached={false} textAlign="left">
                    <ProfileListings rides={rides} handleCancel={handleCancel} />
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
