import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyDXkUwzHP_DMZStEUaOKs9G8sV1-1L5IJc',
  authDomain: 'fbjs6-29927.firebaseapp.com',
  projectId: 'fbjs6-29927',
  storageBucket: 'fbjs6-29927.appspot.com',
  messagingSenderId: '631088805798',
  appId: '1:631088805798:web:f62b8d2398e750e098c167',
  measurementId: 'G-NQNCTS4ECN'
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
