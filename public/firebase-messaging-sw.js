importScripts('https://www.gstatic.com/firebasejs/9.8.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.8.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCXsFVOjD6Cx7MDxu4L-MdLPvFZlfut3Qw',
  authDomain: 'startuplab-devteam.firebaseapp.com',
  projectId: 'startuplab-devteam',
  storageBucket: 'startuplab-devteam.appspot.com',
  messagingSenderId: '398375045701',
  appId: '1:398375045701:web:b82ac63c8249255c77b12c',
  measurementId: 'G-C6EL8W0BRK',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('onBackgroundMessage: ', payload);
  // Customize notification here
  try {
    const notificationTitle = payload.data.title;
    const notificationOptions = {
      body: payload.data.body,
      icon: '/image/logo.png',
    };
    if (notificationTitle) {
      self.registration.showNotification(notificationTitle, notificationOptions);
    }
  } catch (error) {
    console.error(error);
  }
});

self.addEventListener('notificationclick', function (event) {
  // console.log('[Service Worker] Notification click Received.');
  const urlToOpen = new URL(self.location.origin).href;
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      //실행된 브라우저가 있으면 Focus
      let matchClient = null;
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        // console.log(client.url);
        if (client.url.indexOf(urlToOpen) >= 0) {
          matchClient = client;
          break;
        }
      }
      if (matchClient) return client.focus();
      else return clients.openWindow(urlToOpen);
    }),
  );
});
