
import { collection, getDocs, doc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Submission } from './types';

export async function getSubmissions(): Promise<Submission[]> {
  const submissionsRef = collection(db, 'submissions');
  // Sort by 'submittedAt' to show the oldest submissions first.
  // This query requires a composite index on 'status' and 'submittedAt'.
  const q = query(submissionsRef, where('status', '==', 'pending'), orderBy('submittedAt', 'asc'));

  try {
    const querySnapshot = await getDocs(q);
    const submissions = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to a serializable format if needed, though it's often handled automatically.
        // For this client component, we'll assume it's being handled, but this is a point of caution.
        submittedAt: data.submittedAt?.toDate ? data.submittedAt.toDate().toISOString() : new Date().toISOString(),
      } as Submission;
    });
    return submissions;

  } catch (error) {
    console.error("Failed to fetch submissions from Firestore. This might be due to a missing index. Please check the Firebase console.", error);
    return [];
  }
}

export async function deleteSubmission(id: string): Promise<void> {
  const submissionRef = doc(db, 'submissions', id);
  try {
    await deleteDoc(submissionRef);
  } catch (error) {
    console.error(`Failed to delete submission ${id} from Firestore`, error);
    throw error;
  }
}
