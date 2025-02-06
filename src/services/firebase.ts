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
  apiKey: "AIzaSyDLO6LxCZnYRY0ZZGwQZocEQPIr7GFiShs",
  authDomain: "infotechnexus-47b53.firebaseapp.com",
  projectId: "infotechnexus-47b53",
  storageBucket: "infotechnexus-47b53.firebasestorage.app",
  messagingSenderId: "70691322233",
  appId: "1:70691322233:web:61c491e839e3c94eb497a8",
  measurementId: "G-KF3Z6X8VPF"
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

    // Ensure rewards exist with default values if not present
    const rewards = userData?.rewards || {
      points: 0,
      badges: [],
      completedQuizzes: 0
    };

    return {
      uid: user.uid,
      email: user.email,
      fullName: userData?.fullName,
      profileImage: userData?.profileImage,
      completedModules: userData?.completedModules || [],
      achievements: userData?.achievements || [],
      rewards: rewards // Make sure rewards are included in the return
    };
  } catch (error: any) {
    throw new Error(error.message);
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