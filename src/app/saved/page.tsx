
'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BookmarkX, Trash2, CheckCircle, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllTutorials } from '@/lib/tutorials';

type TutorialStatus = 'saved' | 'in-progress' | 'completed';

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
    return (
        <div className="w-full h-full bg-secondary flex flex-col items-center justify-center p-4">
            <span className="text-sm text-muted-foreground">Content</span>
        </div>
    )
}

function SavedTutorialsClient({ allTutorials }: { allTutorials: Tutorial[] }) {
  const [savedTutorials, setSavedTutorials] = useState<Tutorial[]>([]);
  const [statuses, setStatuses] = useState<Record<string, TutorialStatus>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadSavedData = useCallback(() => {
    setIsLoading(true);
    if (typeof window !== 'undefined') {
      const savedIds: string[] = JSON.parse(localStorage.getItem('savedTutorials') || '[]');
      const savedStatuses: Record<string, TutorialStatus> = JSON.parse(localStorage.getItem('tutorialStatuses') || '{}');
      
      setStatuses(savedStatuses);

      if (savedIds.length === 0) {
        setSavedTutorials([]);
        setIsLoading(false);
        return;
      }
      
      const filtered = allTutorials.filter(t => savedIds.includes(t.id));
      setSavedTutorials(filtered);
      setIsLoading(false);
    }
  }, [allTutorials]);

  useEffect(() => {
    loadSavedData();
  }, [loadSavedData]);

  const updateStatus = (tutorialId: string, status: TutorialStatus) => {
    const newStatuses = { ...statuses, [tutorialId]: status };
    setStatuses(newStatuses);
    localStorage.setItem('tutorialStatuses', JSON.stringify(newStatuses));
     toast({
      title: 'Status Updated',
      description: `The status has been changed to "${status.replace('-', ' ')}".`,
    });
  };

  const markAsCompleted = (tutorialId: string) => {
      updateStatus(tutorialId, 'completed');
  };

  const removeTutorial = (tutorialId: string, tutorialTitle: string) => {
    // Remove from saved tutorials
    const savedIds: string[] = JSON.parse(localStorage.getItem('savedTutorials') || '[]');
    const updatedIds = savedIds.filter(id => id !== tutorialId);
    localStorage.setItem('savedTutorials', JSON.stringify(updatedIds));
    setSavedTutorials(prev => prev.filter(t => t.id !== tutorialId));

    // Remove from statuses
    const newStatuses = { ...statuses };
    delete newStatuses[tutorialId];
    setStatuses(newStatuses);
    localStorage.setItem('tutorialStatuses', JSON.stringify(newStatuses));
    
    toast({
      title: 'Removed',
      description: `"${tutorialTitle}" has been removed from your saved list.`,
      variant: 'destructive',
    });
  };

  return (
     <>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({length: 3}).map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-44 w-full" />
                        <Skeleton className="h-5 w-3/4 mt-4" />
                    </CardHeader>
                    <CardContent>
                         <Skeleton className="h-10 w-full" />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Skeleton className="h-9 w-2/5" />
                        <Skeleton className="h-9 w-1/4" />
                    </CardFooter>
                </Card>
            ))}
        </div>
      ) : savedTutorials.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTutorials.map(tutorial => {
            const status = statuses[tutorial.id] || 'saved';
            return (
            <Card key={tutorial.id} className="flex flex-col">
               <CardHeader className="p-0">
                  <Link href={`/tutorial/${tutorial.id}`} className="block aspect-video rounded-t-lg overflow-hidden">
                    <TutorialContent tutorial={tutorial} />
                  </Link>
                  <div className="p-6 pb-2">
                    <Link href={`/tutorial/${tutorial.id}`}>
                      <CardTitle className="font-headline text-lg hover:text-primary transition-colors line-clamp-2">
                          {tutorial.title}
                      </CardTitle>
                    </Link>
                  </div>
              </CardHeader>
              <CardContent className="flex-grow w-full">
                 <Select value={status} onValueChange={(value) => updateStatus(tutorial.id, value as TutorialStatus)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Set status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="saved">Saved</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button variant="outline" size="sm" onClick={() => markAsCompleted(tutorial.id)} disabled={status === 'completed'}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Completed
                </Button>
                <Button variant="destructive" size="sm" onClick={() => removeTutorial(tutorial.id, tutorial.title)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          )})}
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
    </>
  )
}


export default async function SavedPage() {
  const allTutorials = await getAllTutorials();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-center">
          Your Saved Tutorials
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-center">
          Track your learning journey. Update statuses and mark tutorials as completed.
        </p>
      </header>
      
      <SavedTutorialsClient allTutorials={allTutorials} />
    </div>
  );
}
