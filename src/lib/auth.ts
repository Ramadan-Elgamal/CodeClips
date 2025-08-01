
import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';

/**
 * Gets the current user from the Firebase Auth state.
 * This must be called from a Server Component.
 * @returns A promise that resolves with the User object or null.
 */
export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
}
