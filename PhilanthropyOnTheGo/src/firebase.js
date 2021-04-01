
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyB70YR02fzDDeXDjQtVEMNshT09pjdKLIE",
    authDomain: "philanthropy-on-the-go-15508.firebaseapp.com",
    projectId: "philanthropy-on-the-go-15508",
    storageBucket: "philanthropy-on-the-go-15508.appspot.com",
    messagingSenderId: "824409420914",
    appId: "1:824409420914:web:844a389685c96e0818feeb",
    measurementId: "G-TX02K5F85B"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const googleAuth = function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;
             return result.user;
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
        });
    
}
