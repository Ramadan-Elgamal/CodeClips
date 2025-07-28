
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tutorial } from '@/lib/types';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BookmarkX, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SavedPage() {
  const [savedTutorials, setSavedTutorials] = useState<Tutorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadSavedTutorials = useCallback(() => {
    setIsLoading(true);
    if (typeof window !== 'undefined') {
      const savedIds: string[] = JSON.parse(localStorage.getItem('savedTutorials') || '[]');
      
      if (savedIds.length === 0) {
        setSavedTutorials([]);
        setIsLoading(false);
        return;
      }

      fetch('/data.json')
        .then(res => res.json())
        .then((allTutorials: Tutorial[]) => {
          const filtered = allTutorials.filter(t => savedIds.includes(t.id));
          setSavedTutorials(filtered);
          setIsLoading(false);
        }).catch(() => setIsLoading(false));
    }
  }, []);

  useEffect(() => {
    loadSavedTutorials();
  }, [loadSavedTutorials]);

  const removeTutorial = (tutorialId: string, tutorialTitle: string) => {
    const savedIds: string[] = JSON.parse(localStorage.getItem('savedTutorials') || '[]');
    const updatedIds = savedIds.filter(id => id !== tutorialId);
    localStorage.setItem('savedTutorials', JSON.stringify(updatedIds));
    setSavedTutorials(prev => prev.filter(t => t.id !== tutorialId));
    toast({
      title: 'Removed',
      description: `"${tutorialTitle}" has been removed from your saved list.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-center">
          Your Saved Tutorials
        </h1>
      </header>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({length: 3}).map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-24" />
                    </CardContent>
                </Card>
            ))}
        </div>
      ) : savedTutorials.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTutorials.map(tutorial => (
            <Card key={tutorial.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="font-headline text-lg hover:text-primary transition-colors">
                  <Link href={`/tutorial/${tutorial.id}`}>{tutorial.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" size="sm" onClick={() => removeTutorial(tutorial.id, tutorial.title)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card border rounded-lg">
          <BookmarkX className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold font-headline">No Saved Tutorials Yet</h2>
          <p className="mt-2 text-muted-foreground">
            Looks like you haven't saved any tutorials.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Explore Tutorials</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
