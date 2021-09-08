import firebase from 'firebase/app'
import 'firebase/storage'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAgA4CzDKCJ9qOnFT1kOPHgnJik8s5_bhw",
    authDomain: "socialnetwork-2731a.firebaseapp.com",
    projectId: "socialnetwork-2731a",
    storageBucket: "socialnetwork-2731a.appspot.com",
    messagingSenderId: "537856678578",
    appId: "1:537856678578:web:168b4ec7d3e950ae70c7ab",
    measurementId: "G-LWXT1XD6VF"
  };


firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()


export {storage, firebase as default} ;

