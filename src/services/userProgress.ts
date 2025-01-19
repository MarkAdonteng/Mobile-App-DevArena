import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '../services/firebase';

const db = getFirestore(app);

export const fetchUserProgress = async (userId: string): Promise<Record<string, boolean>> => {
  try {
    const userDoc = await getDoc(doc(db, 'userProgress', userId));
    if (userDoc.exists()) {
      return userDoc.data() as Record<string, boolean>;
    }
    return {};
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return {};
  }
};

export const updateUserProgress = async (
  userId: string,
  progress: Record<string, boolean>
): Promise<void> => {
  try {
    await setDoc(doc(db, 'userProgress', userId), progress, { merge: true });
  } catch (error) {
    console.error('Error updating user progress:', error);
  }
}; 