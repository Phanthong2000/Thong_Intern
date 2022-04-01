import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyB8iw_grdr4JPkvonhKYE-SuSrx6jIV7_0',
  authDomain: 'fbjs7-7d3b6.firebaseapp.com',
  projectId: 'fbjs7-7d3b6',
  storageBucket: 'fbjs7-7d3b6.appspot.com',
  messagingSenderId: '573856903587',
  appId: '1:573856903587:web:b408e029d31f043957aa16',
  measurementId: 'G-VYYEE46YDB'
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
