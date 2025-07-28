
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Tutorial } from '@/lib/types';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, BarChart3, Code, ArrowLeft } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const category = decodeURIComponent(params.category as string);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) return;
    const fetchTutorials = async () => {
      try {
        const response = await fetch('/data.json');
        if (!response.ok) {
          throw new Error('Failed to fetch tutorials');
        }
        const data: Tutorial[] = await response.json();
        const filteredTutorials = data.filter(
          (tutorial) => tutorial.category === category
        );
        setTutorials(filteredTutorials);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTutorials();
  }, [category]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
          {category} Tutorials
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Browse our curated list of high-quality {category.toLowerCase()} YouTube tutorials.
        </p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, j) => (
                 <Card key={j} className="overflow-hidden">
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="w-full h-48 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-6 w-1/4" />
                    </CardFooter>
                </Card>
            ))}
        </div>
      ) : error ? (
        <div className="text-center text-destructive">{error}</div>
      ) : tutorials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutorials.map((tutorial) => (
            <Card key={tutorial.id} className="flex flex-col transition-transform transform hover:-translate-y-1 shadow-md hover:shadow-xl">
              <CardHeader>
                <Link href={`/tutorial/${tutorial.id}`} className="block">
                  <CardTitle className="font-headline text-xl leading-tight hover:text-primary transition-colors">{tutorial.title}</CardTitle>
                </Link>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="aspect-video mb-4 rounded-md overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${tutorial.youtubeId}`}
                    title={tutorial.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{tutorial.summary}</p>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground"><BarChart3 className="h-4 w-4 text-accent" /><span className="font-medium text-foreground">{tutorial.difficulty}</span></div>
                    <div className="flex items-center gap-2 text-muted-foreground"><Code className="h-4 w-4 text-accent" /><span className="font-medium text-foreground">{tutorial.language}</span></div>
                    <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4 text-accent" /><span className="font-medium text-foreground">{tutorial.estimatedTime}</span></div>
                </div>
              </CardContent>
              <CardFooter className="flex-wrap gap-2">
                {tutorial.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
                ))}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">No tutorials found for this category.</p>
          <p>We couldn't find any tutorials for "{category}" at the moment.</p>
        </div>
      )}
    </div>
  );
}
