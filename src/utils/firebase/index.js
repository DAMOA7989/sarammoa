const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");
const firebaseConfig = require("config/firebaseConfig");

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
