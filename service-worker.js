self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: 'icon.png',  // 任意: アイコン画像のパス
    badge: 'badge.png'  // 任意: バッジ画像のパス
  };

  event.waitUntil(
    self.registration.showNotification('Push通知タイトル', options)
  );
});
