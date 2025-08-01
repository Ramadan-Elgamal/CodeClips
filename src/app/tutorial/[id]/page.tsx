
import { getTutorialById } from '@/lib/tutorials';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TutorialDetailClient from './TutorialDetailClient';
import { notFound } from 'next/navigation';

export default async function TutorialDetailPage({ params }: { params: { id: string } }) {
  const tutorial = await getTutorialById(params.id);

  if (!tutorial) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
       <Link href={`/category/${encodeURIComponent(tutorial.category)}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to {tutorial.category}
      </Link>
      <TutorialDetailClient tutorial={tutorial} />
    </div>
  );
}
