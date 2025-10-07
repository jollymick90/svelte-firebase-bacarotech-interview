import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import {
  getApp,
  getApps,
  initializeApp,
} from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: env.PUBLIC_FIREBASE_ADMIN_KEY,
  authDomain: env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.PUBLIC_FIRESTORE_STORAGEBUCKET,
  messagingSenderId: env.PUBLIC_FIRESTORE_MESSAGINGSENDERID,
  appId: env.PUBLIC_FIRESTORE_APPID,
  measurementId: env.PUBLIC_FIRESTORE_MEASUREMENTID,
};
let authInstance: ReturnType<typeof getAuth> | undefined;
let googleProviderInstance: GoogleAuthProvider | undefined;

if (browser) {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

  authInstance = getAuth(app);
  googleProviderInstance = new GoogleAuthProvider();
  googleProviderInstance.addScope('https://www.googleapis.com/auth/contacts.readonly');
  googleProviderInstance.setCustomParameters({
    'login_hint': 'user@example.com'
  });
}
const auth = authInstance!;
const googleProvider = googleProviderInstance!;
export { auth, googleProvider };