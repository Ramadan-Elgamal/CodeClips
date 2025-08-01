
import { getSubmissions } from '@/lib/submissions';
import AdminDashboardClient from './AdminDashboardClient';
import { getCurrentUser } from '@/lib/auth';
import { notFound } from 'next/navigation';

const adminUid = process.env.NEXT_PUBLIC_ADMIN_UID;

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user || user.uid !== adminUid) {
    notFound();
  }

  const submissions = await getSubmissions();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-center">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-center">
          Review and approve new tutorial submissions.
        </p>
      </header>
      <AdminDashboardClient initialSubmissions={submissions} />
    </div>
  );
}
