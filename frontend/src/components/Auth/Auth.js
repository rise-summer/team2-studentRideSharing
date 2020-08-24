import React, { useEffect } from 'react';
import { auth } from "../../firebase";

const Auth = {
    isAuthenticated: false,
    uid: "",
    authenticate(uid) {
        Auth.isAuthenticated = true;
        Auth.uid = uid;
    },
    signOut() {
        Auth.isAuthenticated = false;
        Auth.uid = "";
    }
}

export default Auth;