import * as firebase from 'firebase'
import * as firebaseui from 'firebaseui'

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

// Configure FirebaseUI.
export const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /search after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/search',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
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

 export default firebase;
