const webpush = require('web-push');
require('dotenv').config();

// VAPID keys should only be generated only once.
const vapidKeys = {
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY
};

webpush.setVapidDetails(
  'mailto:sample@sample.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// This is the same output of calling JSON.stringify on a PushSubscription
const pushSubscription = {
  endpoint: process.env.END_POINT,
  keys: {
    p256dh: process.env.P256DH,
    auth: process.env.AUTH
  }
};

const payload = 'Push通知メッセージ（サンプル）';

webpush.sendNotification(
  pushSubscription,
  payload
).catch(error => {
  console.error(error.stack);
});
