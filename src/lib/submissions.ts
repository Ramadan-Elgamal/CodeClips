
import { collection, getDocs, doc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { Submission } from './types';

export async function getSubmissions(): Promise<Submission[]> {
  const submissionsRef = collection(db, 'submissions');
  const q = query(submissionsRef, where('status', '==', 'pending'));

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Submission, 'id'>),
    }));
  } catch (error) {
    console.error("Failed to fetch submissions from Firestore", error);
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
