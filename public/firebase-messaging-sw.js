// Scripts for firebase and firebase messaging
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: 'AIzaSyCeqG4gcf0oRrLNjGmUTUXoxAmWkHuO-sM',
  authDomain: 'testjs4-e1bb9.firebaseapp.com',
  projectId: 'testjs4-e1bb9',
  storageBucket: 'testjs4-e1bb9.appspot.com',
  messagingSenderId: '692095054566',
  appId: '1:692095054566:web:cd059a52af2a4bb5678127',
  measurementId: 'G-GTX5C5B9KE'
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  console.log('sw');
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };

  // eslint-disable-next-line no-restricted-globals
  return self.registration.showNotification(notificationTitle, notificationOptions);
});
// messaging.setBackgroundMessageHandler((payload) => {
//   const title = 'Hello world';
//   const options = {
//     body: payload.notification.body
//   };
//   console.log('cc');
//   // eslint-disable-next-line no-restricted-globals
//   return self.registration.showNotification(title, options);
// });
