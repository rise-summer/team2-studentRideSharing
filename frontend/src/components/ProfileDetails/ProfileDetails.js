import React from 'react';
import { Header, List } from 'semantic-ui-react';

const ProfileDetails = () => {
    return (
        <div>
            <List relaxed>
                <List.Item>
                    <List.Content>
                        <List.Header>Car and Payment Listed</List.Header>
                        <List.List>
                            <List.Item>
                                <List.Icon name="car" />
                                <List.Content>
                                    Grey Toyota Corolla (XYZ123)
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name="credit card" />
                                <List.Content>
                                    <List.Header>
                                        Accepts payment through
                                    </List.Header>
                                    <List.Description>
                                        Venmo, Cash
                                    </List.Description>
                                </List.Content>
                            </List.Item>
                        </List.List>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content>
                        <List.Header>Contact Preferences</List.Header>
                        <List.List>
                            <List.Item>
                                <List.Icon name="mail" />
                                <List.Content>ttt@mail.com</List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name="phone" />
                                <List.Content>123.123.1234</List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name="comment alternate" />
                                <List.Content>123.123.1234</List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name="facebook" />
                                <List.Content>facebook.com</List.Content>
                            </List.Item>
                        </List.List>
                    </List.Content>
                </List.Item>
            </List>
        </div>
    );
};

export default ProfileDetails;
