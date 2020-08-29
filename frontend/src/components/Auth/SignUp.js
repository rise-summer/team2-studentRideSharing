import React from 'react';
import { Form, Divider, Button, Dropdown, Input, Image } from 'semantic-ui-react';
import firebase, { auth, uiConfig, storageRef } from '../../firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const querystring = require('querystring');

const initialState = {
    uid: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    school: '',
    phoneNumber: '',
    confirmPassword: '',
    newUserCreated: false,
    schoolOptions: [],
    personalEmail: '',
    personalText: '',
    personalPhone: '',
    facebook: '',
    searchQuery: '',
    photo: null,
    photoURL: 'https://react.semantic-ui.com/images/wireframe/square-image.png'
}

class SignUp extends React.Component {
    //TODO: Add preferred contact methods
    //Combine into one component (see figma layout)
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    //----For profile picture uploading and previewing---------
    uploadPhoto = e => {
        const photo = e.target.files[0];
        if(typeof photo === "object") {
            const photoURL = URL.createObjectURL(photo); // this points to the File object we just created
            this.setState({photoURL, photo});
        }
    }
    //-------------------------------------------

    handleContactMethodAddition = (e, { value }) => {
        this.setState((prevState) => ({
            schoolOptions: [{ text: value, value }, ...prevState.schoolOptions],
        }))
    };

    handleSchoolAutoComplete = (e, { searchQuery }) => {
        this.setState({ searchQuery });
        const encodedSearchWords = encodeURI(searchQuery);
        fetch(`/api/colleges/${encodedSearchWords}`)//TODO: try fetch the whole list all at oncce
            .then((response) => response.json()) //TODO: error handling
            .then((colleges) => {
                this.setState({ schoolOptions: colleges });
            })
            .catch((error) => console.log('error', error));
    };

    handleSchoolChange = (e, { value }) => {
        this.setState({ searchQuery: value, school: value });
    };

    handleChange = (event, {name, value}) => {
        this.setState({[name]: value});
        if(name === "email") {
            this.setState({personalEmail: value});
        } else if(name === "phoneNumber") {
            this.setState({personalText: value, personalPhone: value});
        }
    };

    validate = () => {
        let errorMsg = '';
        const {email, password} = this.state;
        const reEmail = RegExp('([a-zA-Z0-9_\\-.]+)@([a-zA-Z0-9_\\-.]+)\\.([a-zA-Z]{2,5})$');
        const reEdu = RegExp('([a-zA-Z0-9_\\-.]+)@([a-zA-Z0-9_\\-.]+)\\.edu$');
        const validEmail = reEmail.test(email) && reEdu.test(email);
        if (!reEmail) {
            errorMsg += 'Invalid e-mail\n';
        }
        if (!reEdu) {
            errorMsg += 'Only *.edu e-mail addresses can be used\n';
        }
        const validPass = (password.length >= 8);
        if (!validPass) {
            errorMsg += 'Password must be at least 8 characters long\n'
        }
        if (errorMsg) {
            alert(errorMsg);
        }

        return validEmail && validPass;
    };

    handleSubmit = (event) => {
        // alert('Submitted ' + JSON.stringify(this.state));
        // add regex checking and password match
        // pass all info to mongoDB too
        const {email, password} = this.state;
        if (this.validate()) {
            this.createUser();
        }
    };
    //Register the user in MongoDB
    createUserInMongoDB = () => {
        const {
            uid,
            email, 
            password, 
            firstName, lastName, 
            phoneNumber, 
            school, 
            personalEmail, personalText, personalPhone, facebook,
            photoURL
        } = this.state;
        const newUserInfo = {
            uid,
            photoURL,
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            phone: phoneNumber,
            contact: {
                email: personalEmail,
                phone: personalPhone,
                message: personalText,
                facebook
            },
            school: school,
        };
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newUserInfo)
        };
        const xurl = '/api/users/signup';
        fetch(xurl, requestOptions)
            .then(response => {
                if (response.status === 201) {
                    this.setState(initialState);//reset state
                    return response.json();
                } else {//TODO: error handling
                    // throw new error("Failed to create new user in MongoDB" + response.text());
                }
            })
            .then(data => {
                console.log(data); //TODO: NEED CLEAN UP => Printing inserted user document
                this.props.redirect();
            });        

    };

    createUser = () => {
        const {
            email, 
            password, 
            confirmPassword, 
            photo
        } = this.state;

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        //Register the user in Firebase
        auth.createUserWithEmailAndPassword(email, password)
            .then((data) => {     
                //Register the user in MongoDB based on the uid and photo           
                if (photo === null) { //User didn't provide photo
                    this.setState({ 
                        uid: data.user.uid,
                        photoURL: null
                    }, () => {
                        this.createUserInMongoDB();
                    });
                }
                else { //User provides a profile picture
                    var metadata = {//Create file metadata including the content type
                        contentType: 'image/jpeg',
                    };
                    var pathName = `profilePic/${data.user.uid}.jpg`;
                    //Upload the photo to Firebase
                    storageRef.child(pathName).put(photo, metadata).then((snapshot) => {
                        storageRef.child(pathName).getDownloadURL().then((url) => {
                            // `url` is the download URL for user profile picture
                            // This can be downloaded directly
                            var user = auth.currentUser;
                            // Update user profile in firebase
                            user.updateProfile({
                                photoURL: url
                            }).then(function() {
                                // Update successful.
                            }).catch(function(error) {
                            // An error happened.
                            });
                            // Register the user in MongoDB
                            this.setState({ 
                                uid: user.uid,
                                photoURL: url
                            }, () => {
                                this.createUserInMongoDB();
                            }); 
                        }).catch(function(error) {
                            console.log(error);
                        });
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
                alert(error.code + '\n' + error.message)
            });
    };

    render() {
        const {
            contactMethod,
            firstName,
            lastName,
            email,
            personalEmail,
            personalPhone,
            personalText,
            facebook,
            school,
            phoneNumber,
            password,
            confirmPassword,
            schoolOptions,
            searchQuery,
            photoURL
        } = this.state;
        return (
            <div>
                {/* TODO: setup redirect after new user created */}
                <Form onSubmit={this.handleSubmit}>
                    <center>
                    <Button as="label" htmlFor="file" type="button" size='tiny' circular>
                        <Image src={photoURL} size='tiny' circular />
                    </Button>
                    <input
                        type="file"
                        id="file"
                        hidden
                        accept="image/*"
                        onChange={this.uploadPhoto}
                    />
                    </center>
                    <Form.Input
                        id="first-name"
                        name="firstName"
                        label="First Name"
                        value={firstName}
                        onChange={this.handleChange}
                        required
                    />
                    <Form.Input
                        id="last-name"
                        name="lastName"
                        label="Last Name"
                        value={lastName}
                        onChange={this.handleChange}
                        required
                    />
                    <Form.Input
                        id="email"
                        name="email"
                        label="Email"
                        value={email}
                        onChange={this.handleChange}
                        required
                    />
                    <Form.Dropdown
                        label="College Name"
                        options={schoolOptions}
                        placeholder='Select School'
                        search
                        searchQuery={searchQuery}
                        selection
                        allowAdditions
                        value={school}
                        onAddItem={this.handleContactMethodAddition}
                        onChange={this.handleSchoolChange}
                        onSearchChange={this.handleSchoolAutoComplete}
                        required
                    />
                    <Form.Input
                        id="phone-number"
                        name="phoneNumber"
                        label="Phone Number"
                        value={phoneNumber}
                        onChange={this.handleChange}
                        required
                    />
                    <Form.Input
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={this.handleChange}
                        required
                    />
                    <Form.Input
                        id="confirm-password"
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={this.handleChange}
                        required
                    />
                    <Form.Field>
                        <label>How would you like others to contact you?</label>
                    </Form.Field>
                    <Form.Group inline>
                        <Form.Input
                            label="Email"
                            name="personalEmail"
                            value={personalEmail}
                            onChange={this.handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group inline>
                        <Form.Input
                            label="Phone (Call)"
                            name="personalPhone"
                            value={personalPhone}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group inline>
                        <Form.Input
                            label="Cell Phone (Text)"
                            name="personalText"
                            value={personalText}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group inline>
                        <Form.Input
                            label="Facebook (Link)"
                            name="facebook"
                            value={facebook}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Button
                        id="submit"
                        control={Button}
                        fluid
                        color="black"
                        content="Create an account"
                    />
                </Form>
                {/*<Divider horizontal>Or</Divider>*/}
                {/*[Login with google button]*/}
                {/*<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />*/}
            </div>
        );
    }
}

export default SignUp;
