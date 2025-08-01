
import { getTutorialsByCategory } from '@/lib/tutorials';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CategoryTutorials from './CategoryTutorials';

export default async function CategoryPage({ params }: { params: { category: string }}) {
  const categoryName = decodeURIComponent(params.category as string);
  const tutorials = await getTutorialsByCategory(categoryName);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
          {categoryName} Tutorials
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Browse our curated list of high-quality {categoryName.toLowerCase()} YouTube tutorials.
        </p>
      </header>
      
      <CategoryTutorials initialTutorials={tutorials} />
    </div>
  );
}
