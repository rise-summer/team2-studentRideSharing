import React from 'react';
import ProfileDetails from './ProfileDetails';
import ProfileListings from './ProfileListings';
import ProfileRequests from './ProfileRequests';
import { Tab, Menu, Label } from 'semantic-ui-react';

const ProfileTabs = ({ userID, vehicles, contact, email, rides, handleCancel }) => {
    const panes = [
        {
            menuItem: (
                <Menu.Item key="listings">
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
            menuItem: {content: 'My Requests', key: "requests"},
            render: () => (
                <Tab.Pane attached={false}>
                    <ProfileRequests userID={userID}/>
                </Tab.Pane>
            ),
        },
        {
            menuItem: {content: 'My Profile', key: "profile"},
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
