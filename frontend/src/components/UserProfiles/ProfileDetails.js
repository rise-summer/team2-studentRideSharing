import React from 'react';
import { List, Button, Icon } from 'semantic-ui-react';

//TODO: change it to class component
const ProfileDetails = ({ user: {email, contact, paymentMethods}, vehicles, isEditing }) => {
    const vehicleList = vehicles.map((vehicle, index) => {
        const { color, make, model, plate } = vehicle;
        const vehicleString = `${color} ${make} ${model} (${plate})`;
        return (
            <List.Item key={index}>
                <List.Icon name="car" />
                <List.Content>{vehicleString}</List.Content>
            </List.Item>
        );
    });
    
    const editPaymentMethods = () => {
        //setstate -> editingPaymentMethods
    }

    return (
        <div>
            <List relaxed>
                <List.Item>
                    <List.Content>
                        <List.Header>Car and Payment Listed</List.Header>
                        <List.List>
                            {vehicleList}
                            <List.Item>
                                <List.Icon name="credit card" />
                                <List.Content>
                                    <List.Header>
                                        Accepts payment through
                                        { 
                                            isEditing && 
                                            <Button icon style={{backgroundColor: 'white', borderRadius: 0}}
                                            onClick={editPaymentMethods}>
                                                <Icon name='pencil alternate' />
                                            </Button>
                                        }
                                    </List.Header>
                                    <List.Description>
                                    {paymentMethods && paymentMethods.map((value, index) => {
                                        return index === 0 ? <span key={index}>{value}</span> : <span key={index}>, {value}</span>
                                    })}
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
