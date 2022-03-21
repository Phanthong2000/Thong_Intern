import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyAzVVD2OzN5vBsxtTSbbg3uHV0Oix55DlA',
  authDomain: 'fbjs2-4c06b.firebaseapp.com',
  projectId: 'fbjs2-4c06b',
  storageBucket: 'fbjs2-4c06b.appspot.com',
  messagingSenderId: '610477517978',
  appId: '1:610477517978:web:0dc5f568428f90788f0323',
  measurementId: 'G-08D13NYBZ7'
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
