import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyDI0DLoHy4Xdk9t_y_WNNWpKjotcrDIEGg',
  authDomain: 'testjs7-752ee.firebaseapp.com',
  projectId: 'testjs7-752ee',
  storageBucket: 'testjs7-752ee.appspot.com',
  messagingSenderId: '458277911249',
  appId: '1:458277911249:web:1eca7196a9a8f58da723f0',
  measurementId: 'G-TQD5F2ECDZ'
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
