import React from 'react';
import { List } from 'semantic-ui-react';

const ProfileDetails = ({ vehicles, email, contact }) => {
    const vehicleList = vehicles.map((vehicle) => {
        const { color, make, model, plate } = vehicle;
        const vehicleString = `${color} ${make} ${model} (${plate})`;
        return (
            <List.Item key="plate">
                <List.Icon name="car" />
                <List.Content>{vehicleString}</List.Content>
            </List.Item>
        );
    });

    return (
        <div>
            <List relaxed>
                <List.Item>
                    <List.Content>
                        {/* <List.Header>Car and Payment Listed</List.Header> */}
                        <List.Header>Cars</List.Header>
                        <List.List>
                            {vehicleList}
                            {/* <List.Item>
                                <List.Icon name="credit card" />
                                <List.Content>
                                    <List.Header>
                                        Accepts payment through
                                    </List.Header>
                                    <List.Description>
                                        Venmo, Cash
                                    </List.Description>
                                </List.Content>
                            </List.Item> */}
                        </List.List>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content>
                        <List.Header>Contact Preferences</List.Header>
                        <List.List>
                            {email && (
                                <List.Item>
                                    <List.Icon name="mail" />
                                    <List.Content>{email}</List.Content>
                                </List.Item>
                            )}
                            {contact.phone && (
                                <List.Item>
                                    <List.Icon name="phone" />
                                    {/* TODO: Add formatter */}
                                    <List.Content>{contact.phone}</List.Content>
                                </List.Item>
                            )}
                            {contact.text && (
                                <List.Item>
                                    <List.Icon name="comment alternate" />
                                    <List.Content>123.123.1234</List.Content>
                                </List.Item>
                            )}
                            {contact.facebook && (
                                <List.Item>
                                    <List.Icon name="facebook" />
                                    <List.Content>facebook.com</List.Content>
                                </List.Item>
                            )}
                        </List.List>
                    </List.Content>
                </List.Item>
            </List>
        </div>
    );
};

export default ProfileDetails;
