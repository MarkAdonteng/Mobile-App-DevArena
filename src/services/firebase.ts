import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAxIYviNtpuznfHCKsWypX2XZw15fTU4Fk",
  authDomain: "mobileait-e4cd5.firebaseapp.com",
  projectId: "mobileait-e4cd5",
  storageBucket: "mobileait-e4cd5.firebasestorage.app",
  messagingSenderId: "1029323796154",
  appId: "1:1029323796154:web:9863fd4c2aa7d926671c83",
  measurementId: "G-W9GMZ4LKHY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const signUp = async (email: string, password: string, fullName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with full name
    await updateProfile(user, {
      displayName: fullName
    });

    // Store additional user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      fullName,
      email,
      createdAt: new Date().toISOString(),
      points: 0,
      completedModules: [],
      achievements: [],
      rewards: {
        points: 0,
        badges: [],
        completedQuizzes: 0
      }
    });

    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get additional user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    if (!userData) {
      throw new Error('User data not found');
    }

    // Ensure we return data matching the User type
    return {
      uid: user.uid,
      email: user.email || '',  // Convert null to empty string
      fullName: userData.fullName || '',
      profileImage: userData.profileImage || '',
      completedModules: userData.completedModules || [],
      achievements: userData.achievements || [],
      rewards: userData.rewards || {
        points: 0,
        badges: [],
        completedQuizzes: 0
      }
    };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const fetchUserData = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    const userData = userDoc.data();

    if (!userData) {
      // Initialize with default values if no data exists
      const defaultUserData = {
        uid,
        email: '',
        fullName: '',
        profileImage: '',
        completedModules: [],
        achievements: [],
        rewards: {
          points: 0,
          badges: [],
          completedQuizzes: 0
        }
      };
      
      // Create the user document with default values
      await setDoc(doc(db, 'users', uid), defaultUserData);
      return defaultUserData;
    }

    return {
      uid,
      email: userData.email || '',
      fullName: userData.fullName || '',
      profileImage: userData.profileImage || '',
      completedModules: userData.completedModules || [],
      achievements: userData.achievements || [],
      rewards: userData.rewards || {
        points: 0,
        badges: [],
        completedQuizzes: 0
      }
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export { auth, db, app };