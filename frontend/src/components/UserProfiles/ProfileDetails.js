import React from 'react';
import { List, Button, Icon, Grid, Header } from 'semantic-ui-react';

//TODO: change it to class component
const ProfileDetails = ({ user: {email, contact, paymentMethods}, vehicles, isEditing }) => {
    const vehicleList = vehicles.map((vehicle, index) => {
        const { color, make, model, plate } = vehicle;
        const vehicleString = `${color} ${make} ${model} (${plate})`;
        return (
            <List.Item key={index}>
                <List.Icon color="violet" name="car" />
                <List.Content>{vehicleString}</List.Content>
            </List.Item>
        );
    });
    
    const editPaymentMethods = () => {
        //setstate -> editingPaymentMethods
    }

    return (
        <div style={{ width: "70%", margin: "auto" }}>
            <Grid columns={2} relaxed centered>
                <Grid.Column>
                    <Header>Car and Payment Listed</Header>
                    <List relaxed>
                        {vehicleList}
                        <List.Item>
                            <List.Icon color="violet" name="credit card" />
                            <List.Content>
                                    Accepts payment through
                                    { 
                                        isEditing && 
                                        <Button icon style={{backgroundColor: 'white', borderRadius: 0}}
                                        onClick={editPaymentMethods}>
                                            <Icon name='pencil alternate' />
                                        </Button>
                                    }
                                <List.Description>
                                {paymentMethods && paymentMethods.map((value, index) => {
                                    return index === 0 ? <span key={index}>{value}</span> : <span key={index}>, {value}</span>
                                })}
                                </List.Description>
                            </List.Content>
                        </List.Item>
                    </List>
                </Grid.Column>
                <Grid.Column
                    // style={{width: "50%"}}
                >
                    <Header>Contact Preferences</Header>
                    <List relaxed>               
                            {email && (
                                <List.Item>
                                    <List.Icon color="violet" name="mail" />
                                    <List.Content>{email}</List.Content>
                                </List.Item>
                            )}
                            {contact.phone && (
                                <List.Item>
                                    <List.Icon color="violet" name="phone" />
                                    {/* TODO: Add formatter */}
                                    <List.Content>{contact.phone}</List.Content>
                                </List.Item>
                            )}
                            {contact.text && (
                                <List.Item>
                                    <List.Icon color="violet" name="comment alternate" />
                                    <List.Content>123.123.1234</List.Content>
                                </List.Item>
                            )}
                            {contact.facebook && (
                                <List.Item>
                                    <List.Icon color="violet" name="facebook" />
                                    <List.Content>facebook.com</List.Content>
                                </List.Item>
                            )}
                </List>
                            </Grid.Column>
            </Grid>
        </div>
    );
};

export default ProfileDetails;
