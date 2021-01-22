// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebsae";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCP7KVzPu0Nl77CcbqQrV5CAy-YJftXSPE",
  authDomain: "instagram-lite-62791.firebaseapp.com",
  databaseURL: "https://instagram-lite-62791-default-rtdb.firebaseio.com",
  projectId: "instagram-lite-62791",
  storageBucket: "instagram-lite-62791.appspot.com",
  messagingSenderId: "357944016177",
  appId: "1:357944016177:web:76018f9e1ab7cc1a90c410",
  measurementId: "G-JPZJJV1G10",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
