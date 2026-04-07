importScripts("https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/12.11.0/firebase-messaging.js");

const firebaseConfig = {
    apiKey: "AIzaSyA3gohTf1rzOYBBQCI-WD8ORoTK4DOf-fw",
    authDomain: "akademia-c56ff.firebaseapp.com",
    databaseURL: "https://akademia-c56ff-default-rtdb.firebaseio.com",
    projectId: "akademia-c56ff",
    storageBucket: "akademia-c56ff.firebasestorage.app",
    messagingSenderId: "678278775270",
    appId: "1:678278775270:web:ed5aee3d358d613c8cd627",
    measurementId: "G-X3CHCJE5LK"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const { title, body } = payload.notification;
    self.registration.showNotification(title, { body, icon: "/icon-192.png" });
});
