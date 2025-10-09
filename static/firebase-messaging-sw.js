importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js');

const messaging = firebase.messaging();

// Called when a push arrives and the page is in the background/closed
messaging.onBackgroundMessage((payload) => {
  // Customize your notification
  const { title, body, icon } = payload.notification ?? {};
  self.registration.showNotification(title || 'New message', {
    body,
    icon,
    data: payload.data || {}
  });
});

// (Optional) Click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification?.data?.click_action || '/';
  event.waitUntil(clients.openWindow(url));
});
