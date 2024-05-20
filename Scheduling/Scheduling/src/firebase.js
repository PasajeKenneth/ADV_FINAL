import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCzVHYhV0EUTCTILW79t-46GhBL81nc-ac",
  authDomain: "schedulingadv-34fe6.firebaseapp.com",
  databaseURL: "https://schedulingadv-34fe6-default-rtdb.firebaseio.com",
  projectId: "schedulingadv-34fe6",
  storageBucket: "schedulingadv-34fe6.appspot.com",
  messagingSenderId: "201597858578",
  appId: "1:201597858578:web:6f636c7305631471fa79cb"
};

firebase.initializeApp(firebaseConfig);
const fireDb = firebase.database();
export default fireDb.ref();