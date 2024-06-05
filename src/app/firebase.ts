import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYYQNw1WkbCpfy5wTWvFDyZtn3f7eXIgY",
  authDomain: "crecipay-97537.firebaseapp.com",
  projectId: "crecipay-97537",
  storageBucket: "crecipay-97537.appspot.com",
  messagingSenderId: "503547510269",
  appId: "1:503547510269:web:34378191879a25d94ced94",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore();

const auth = getAuth(app);

export { app, db, auth };
