import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCvmOtbz-rovc41A89QDWv8NicSMeUZr9M",
  authDomain: "lms-app-8747a.firebaseapp.com",
  projectId: "lms-app-8747a",
  storageBucket: "lms-app-8747a.appspot.com",
  messagingSenderId: "390488405873",
  appId: "1:390488405873:web:8b1ebb066c47c0dcd3e8d0",
  measurementId: "G-RSFR8ZMVBF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
