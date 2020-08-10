import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCeOp01ZqIyK4WeKJa90y2HRtclyOo2Jec",
  authDomain: "musicfy-32e27.firebaseapp.com",
  databaseURL: "https://musicfy-32e27.firebaseio.com",
  projectId: "musicfy-32e27",
  storageBucket: "musicfy-32e27.appspot.com",
  messagingSenderId: "1020798851062",
  appId: "1:1020798851062:web:f5315e433385e4e1f419d7"
};
export default firebase.initializeApp(firebaseConfig);