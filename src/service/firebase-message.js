import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { setFcmToken } from '/@service/login';
import { getBadges } from '/@service/api';

import common from '/@service/common';

const init = () => {
  try {
    const firebaseConfig = {
      apiKey: 'AIzaSyCXsFVOjD6Cx7MDxu4L-MdLPvFZlfut3Qw',
      authDomain: 'startuplab-devteam.firebaseapp.com',
      projectId: 'startuplab-devteam',
      storageBucket: 'startuplab-devteam.appspot.com',
      messagingSenderId: '398375045701',
      appId: '1:398375045701:web:b82ac63c8249255c77b12c',
      measurementId: 'G-C6EL8W0BRK',
    };
    const vapidKey = {
      vapidKey: 'BB4LpH1L2DrJ_omeMnJs8bEm9SKFT5tANE_Ab3PLehe3zgWApck1ZZ5zT7rqVCDhVqZlgNBObhRaKSmNx0zvFwc',
    };

    // // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    // 알림 수신을 위한 사용자 권한 요청
    Notification.requestPermission().then((permission) => {
      // console.log('permission ', permission);
      if (permission !== 'granted') {
        alert('알림을 허용해주세요');
      }
    });
    getToken(messaging, vapidKey)
      .then((currentToken) => {
        // console.log(currentToken);
        if (currentToken) {
          localStorage.setItem(common.FCM_TOKEN, currentToken);
          const param = {};
          param.fcm_token = currentToken;
          setFcmToken(param);
          // Send the token to your server and update the UI if necessary
          // ...
        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
          // ...
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });
    onMessage(messaging, (payload) => {
      console.log('onMessage: ', payload);
      const data = payload.data;
      switch (data.cmd) {
        case 1:
          window.location.reload();
          break;
        case 2:
          getBadges();
          break;
        default:
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export default init;
