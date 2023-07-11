import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCDkfr8oPTKVlycFuWe6P99oqREV__ZHAw",
  authDomain: "kinos-597de.firebaseapp.com",
  projectId: "kinos-597de",
  storageBucket: "kinos-597de.appspot.com",
  messagingSenderId: "58533156324",
  appId: "1:58533156324:web:679af19f0908ce494063f1",
  measurementId: "G-TZL7T5BTZS"
  };
  

const app = initializeApp(firebaseConfig);
// db情報をexport
export const db = getFirestore(app);


