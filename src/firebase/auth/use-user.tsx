'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';
import { setDocumentNonBlocking } from '../non-blocking-updates';
import { doc } from 'firebase/firestore';
import { useFirestore } from '..';

export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
}

export function useUser(): UserHookResult {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    if (!auth || !firestore) {
      setIsUserLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userRef = doc(firestore, 'users', firebaseUser.uid);
        
        const isGoogleSignIn = firebaseUser.providerData.some(
          (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
        );

        let displayName = firebaseUser.displayName;
        let photoURL = firebaseUser.photoURL;

        if (!isGoogleSignIn && !displayName && firebaseUser.email) {
            displayName = firebaseUser.email.split('@')[0];
        }

        setDocumentNonBlocking(
          userRef,
          {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: displayName,
            photoURL: photoURL,
            termsAgreed: true,
          },
          { merge: true }
        );
      } else {
        setUser(null);
      }
      setIsUserLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  return { user, isUserLoading };
}
