import { useEffect } from 'react';
import { auth, fetchUserData } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useUser } from './context/UserContext';

function App() {
  const { setUser } = useUser();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        try {
          const userData = await fetchUserData(firebaseUser.uid);
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        // User is signed out
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  // ... rest of App component
}

export default App; 