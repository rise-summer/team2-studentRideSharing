// import * as firebase from 'firebase'
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyBStZvVTJgu72YYfA4bo-cQiQwIbX5OpOw",
    authDomain: "studentridesharing-a50e3.firebaseapp.com",
    databaseURL: "https://studentridesharing-a50e3.firebaseio.com",
    projectId: "studentridesharing-a50e3",
    storageBucket: "studentridesharing-a50e3.appspot.com",
    messagingSenderId: "469867227113",
    appId: "1:469867227113:web:a1974b81c2662db6eccd78",
    measurementId: "G-CKDKQ4ZLQH"
};

firebase.initializeApp(config);
export const auth = firebase.auth();
export const firestore = firebase.firestore();

const redirectUrl = '/profile';
// Configure FirebaseUI.
export const uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // User successfully signed in.
            auth.onAuthStateChanged()
            .then((data) => {
                console.log(data);
                const {uid, email, displayName} = data;
                //check if the uid exist in MongoDB
                fetch(`/api/users/${uid}`)
                .then(response => {
                    if(response.status === 404) { //if new user
                        //register the new user to MongoDB
                        const newUserInfo = {
                            uid: uid,
                            email: email,
                            firstName: displayName,
                            // lastName: this.state.lastName,
                            // contact: {phone: this.state.phoneNumber},
                            // paymentMethods: ['Venmo', 'Cash', 'Zelle'],
                            // school: 'School University'
                        };
                        const requestOptions = {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify(newUserInfo)
                        };
                        fetch('/api/users/signup', requestOptions)
                            .then(response => {
                                if (response.status === 201) {
                                    return true;
                                } else {//TODO: error handling e.g. 409 conflict
                                    throw new Error("Failed to create new user in MongoDB" + response.text());
                                }
                            })
                    }
                    return false;
                })
                .catch(error => console.log('error', error));
              }
            );
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return false;
        }
    },
    // Popup signin flow rather than redirect flow.
    signInFlow: 'redirect',
    // Redirect to /search after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/search',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ]
};

export const generateUserDocument = async (user, additionalData) => {
    if (!user) return;
    const userRef = firestore.doc(`users/${user.uid}`);
    const snapshot = await userRef.get();
    if (!snapshot.exists) {
        const {email, displayName, photoURL} = user;
        try {
            await userRef.set({
                displayName,
                email,
                photoURL,
                ...additionalData
            });
        } catch (error) {
            console.error("Error creating user document", error);
        }
    }
    return getUserDocument(user.uid);
};
const getUserDocument = async uid => {
    if (!uid) return null;
    try {
        const userDocument = await firestore.doc(`users/${uid}`).get();
        return {
            uid,
            ...userDocument.data()
        };
    } catch (error) {
        console.error("Error fetching user", error);
    }
};

function createUser(email, password) {
    firebase.auth.createUserWithEmailAndPassword(email, password);
}

export default firebase;
