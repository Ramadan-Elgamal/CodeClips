
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Tutorial } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, BarChart3, Code, FileText } from 'lucide-react';

function TutorialContent({ tutorial }: { tutorial: Tutorial }) {
    if (tutorial.type === 'video' || tutorial.type === 'playlist') {
        const imageUrl = tutorial.imageUrl || `https://placehold.co/400x225.png`;
        return (
            <Image
                src={imageUrl}
                alt={tutorial.title}
                width={400}
                height={225}
                className="w-full h-full object-cover"
                data-ai-hint="project thumbnail"
            />
        )
    }
    
    if (tutorial.type === 'article') {
        return (
            <div className="w-full h-full bg-secondary flex flex-col items-center justify-center p-4">
                <FileText className="h-12 w-12 text-muted-foreground mb-2"/>
                <span className="text-sm text-muted-foreground">Article</span>
            </div>
        )
    }
    
    // Fallback for unknown types
    return (
        <div className="w-full h-full bg-secondary flex flex-col items-center justify-center p-4">
            <span className="text-sm text-muted-foreground capitalize">{tutorial.type}</span>
        </div>
    )
}

export default function AllTutorialsPage() {
  const [allTutorials, setAllTutorials] = useState<Tutorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const response = await fetch('/data.json');
        if (!response.ok) {
          throw new Error('Failed to fetch tutorials');
        }
        const data: Tutorial[] = await response.json();
        setAllTutorials(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTutorials();
  }, []);

  const tutorialsByCategory = useMemo(() => {
    return allTutorials.reduce((acc, tutorial) => {
      const { category } = tutorial;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(tutorial);
      return acc;
    }, {} as Record<string, Tutorial[]>);
  }, [allTutorials]);

  const sortedCategories = useMemo(() => {
    return Object.keys(tutorialsByCategory).sort();
  }, [tutorialsByCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
          All Coding Project Tutorials
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Browse our curated list of high-quality YouTube tutorials to build amazing applications and level up your skills.
        </p>
      </header>
      
      {isLoading ? (
        <div className="space-y-12">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                    <Skeleton className="h-8 w-1/4 mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 3 }).map((_, j) => (
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
                </div>
            ))}
        </div>
      ) : error ? (
        <div className="text-center text-destructive">{error}</div>
      ) : sortedCategories.length > 0 ? (
        <div className="space-y-16">
          {sortedCategories.map(category => (
            <section key={category}>
              <h2 className="text-3xl font-bold font-headline mb-8 border-b pb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tutorialsByCategory[category].map((tutorial) => (
                  <Card key={tutorial.id} className="flex flex-col transition-transform transform hover:-translate-y-1 shadow-md hover:shadow-xl">
                    <CardHeader>
                      <Link href={`/tutorial/${tutorial.id}`} className="block">
                        <CardTitle className="font-headline text-xl leading-tight hover:text-primary transition-colors">{tutorial.title}</CardTitle>
                      </Link>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="aspect-video mb-4 rounded-md overflow-hidden">
                        <TutorialContent tutorial={tutorial} />
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
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">No tutorials found.</p>
          <p>We couldn't find any tutorials at the moment.</p>
        </div>
      )}
    </div>
  );
}
