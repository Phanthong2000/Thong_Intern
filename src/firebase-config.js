import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBoH8FLROtbEjx1dyqlHpxYO9f7UndjOY0',
  authDomain: 'testjs3-d4c9f.firebaseapp.com',
  projectId: 'testjs3-d4c9f',
  storageBucket: 'testjs3-d4c9f.appspot.com',
  messagingSenderId: '320509537527',
  appId: '1:320509537527:web:396688cf229f1a2920f7f2',
  measurementId: 'G-NCDKW1WE81'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
