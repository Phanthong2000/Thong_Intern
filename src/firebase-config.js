import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCeqG4gcf0oRrLNjGmUTUXoxAmWkHuO-sM',
  authDomain: 'testjs4-e1bb9.firebaseapp.com',
  projectId: 'testjs4-e1bb9',
  storageBucket: 'testjs4-e1bb9.appspot.com',
  messagingSenderId: '692095054566',
  appId: '1:692095054566:web:cd059a52af2a4bb5678127',
  measurementId: 'G-GTX5C5B9KE'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
