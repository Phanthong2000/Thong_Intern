import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyD285zRCUYOT7D7QnfpBv4GChAv11A7U38',
  authDomain: 'testjs5-f0a74.firebaseapp.com',
  projectId: 'testjs5-f0a74',
  storageBucket: 'testjs5-f0a74.appspot.com',
  messagingSenderId: '915729010442',
  appId: '1:915729010442:web:cd87248c21d7c118c1b4f3',
  measurementId: 'G-7TQ2MPYEJ9'
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
