require('dotenv').config();

/**
 * service workerの登録
 */
const registerServiceWorker = async () => {
  try {
    await navigator.serviceWorker.register('service-worker.js');
    console.log('Service Workerが登録されました');
  } catch (error) {
    console.error('Service Workerの登録中にエラーが発生しました:', error);
  }
}

/**
 * 通知設定ON
 */
const createSubscription = async () => {

  try {
    await registerServiceWorker();
    const swReg = await navigator.serviceWorker.ready;
    const subscription = await swReg.pushManager.getSubscription();

    if (subscription === null) {
      console.log('購読を開始します');
      const vapidPublicKey = process.env.PUBLIC_KEY;
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      const newSubscription = await swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });

      console.log(JSON.stringify(newSubscription)); // 新しい購読情報をコンソールに出力
    } else {
      console.log('既に購読済みです');
    }
  } catch (error) {
    console.error('Service Worker Error', error);
  }
}

/**
 * 通知設定OFF
 */
const cancelSubscription = async () => {
  await registerServiceWorker();
  const swReg = await navigator.serviceWorker.ready;
  const subscription = await swReg.pushManager.getSubscription();

  if (subscription) {
    const successful = await subscription.unsubscribe();
    if (successful) {
      console.log('購読がキャンセルされました');
    } else {
      console.error('購読のキャンセルに失敗しました');
    }
  } else {
    console.error('購読は存在しません');
  }
}

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const checkIsWebPushSupported = async () => {
  // グローバル空間にNotificationがあればNotification APIに対応しているとみなす
  if (!('Notification' in window)) {
    // const message = 'Notification APIに対応していません';
    // fetch('http://localhost:3000/log', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ message }),
    // });
    console.log('Notification APIに対応していません');
    return false;
  } else {
    console.log('Notification APIに対応しています');
  }
  // グローバル変数navigatorにserviceWorkerプロパティがあればサービスワーカーに対応しているとみなす
  if (!('serviceWorker' in navigator)) {
    console.log('serviceWorkerに対応していません');
    return false;
  } else {
    console.log('service workerに対応しています。');
  }
  try {
    const sw = await navigator.serviceWorker.ready;
    // 利用可能になったサービスワーカーがpushManagerプロパティがあればPush APIに対応しているとみなす
    if (!('pushManager' in sw)) {
      console.log('pushManagerに対応していません');
      // return false;
    } else {
      console.log('pushManagerに対応しています');
    }
    return true;
  } catch (error) {
    return false;
  }
}

const buttonClick = async () => {
  console.log('確認');
  await checkIsWebPushSupported();
};

