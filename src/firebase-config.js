import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyD0LRIKYL8DVXldeJLkZ2KrcIqrc-PnNrw',
  authDomain: 'testjs2-97df7.firebaseapp.com',
  projectId: 'testjs2-97df7',
  storageBucket: 'testjs2-97df7.appspot.com',
  messagingSenderId: '348332545697',
  appId: '1:348332545697:web:70882182d589da08ed02e0',
  measurementId: 'G-0NZNHLJX7E'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
