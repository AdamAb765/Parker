// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmWfqmRMS3f292GWMas8ypOWrsmYzV_lY",
  authDomain: "parker-385016.firebaseapp.com",
  projectId: "parker-385016",
  storageBucket: "parker-385016.appspot.com",
  messagingSenderId: "428300137932",
  appId: "1:428300137932:web:1bb367986abe046c96d969",
  measurementId: "G-9PWP0V85KN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };
