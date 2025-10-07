import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyBOLAGBhEg7Oa4gIpJzHrF6Wefr07qzQmg",
  authDomain: "my-next-app-5e952.firebaseapp.com",
  projectId: "my-next-app-5e952",
  storageBucket: "my-next-app-5e952.firebasestorage.app",
  messagingSenderId: "247447079163",
  appId: "1:247447079163:web:b0d455841f74f7ba52485e",
  measurementId: "G-RC0NTWC29P",
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
