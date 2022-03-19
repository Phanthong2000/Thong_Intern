import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyAE3iKdAEuLoJKQhZVyb2tVUO-Dzzh-bTE',
  authDomain: 'testjs6-9c759.firebaseapp.com',
  projectId: 'testjs6-9c759',
  storageBucket: 'testjs6-9c759.appspot.com',
  messagingSenderId: '384404016875',
  appId: '1:384404016875:web:1ddc230e19306f7d3978ae',
  measurementId: 'G-KTFFYBQDQQ'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// export const messaging = getMessaging(app);
// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//       console.log('payload', payload);
//       resolve(payload);
//     });
//   });
