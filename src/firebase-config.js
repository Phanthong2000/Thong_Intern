import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAQfyxWhMeuxYlElUL8pmUUydFr6pN24M8',
  authDomain: 'testreactjs-b8952.firebaseapp.com',
  projectId: 'testreactjs-b8952',
  storageBucket: 'testreactjs-b8952.appspot.com',
  messagingSenderId: '1099308445105',
  appId: '1:1099308445105:web:b227e8f7e231b9b9112190',
  measurementId: 'G-7PZB828B1F'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
