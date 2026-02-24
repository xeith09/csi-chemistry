import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZkHs8vWUoenKcKqclmx-ykaNBs5167tA",
  authDomain: "csi-chemistry.firebaseapp.com",
  projectId: "csi-chemistry",
  storageBucket: "csi-chemistry.firebasestorage.app",
  messagingSenderId: "704621167351",
  appId: "1:704621167351:web:8d24307c6d58e7dbd609f2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);