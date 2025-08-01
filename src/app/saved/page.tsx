
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
import { BookmarkX, Trash2, CheckCircle, FileText, LogIn } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { doc, getDocs, collection, deleteDoc, updateDoc } from 'firebase/firestore';

type TutorialStatus = 'saved' | 'in-progress' | 'completed';

function TutorialContent({ tutorial }: { tutorial: Tutorial }) {
    const imageUrl = tutorial.imageUrl || `https://placehold.co/400x225.png`;
    if (tutorial.type === 'video' || tutorial.type === 'playlist') {
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

interface SavedTutorial extends Tutorial {
  status: TutorialStatus;
}

export default function SavedPage() {
  const { user } = useAuth();
  const [savedTutorials, setSavedTutorials] = useState<SavedTutorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadSavedData = useCallback(async () => {
    if (!user) {
        setSavedTutorials([]);
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    try {
        const savedTutorialsRef = collection(db, `users/${user.uid}/savedTutorials`);
        const querySnapshot = await getDocs(savedTutorialsRef);
        const tutorials = querySnapshot.docs.map(doc => ({
            ...(doc.data() as Tutorial),
            id: doc.id,
            status: doc.data().status || 'saved'
        } as SavedTutorial));
        setSavedTutorials(tutorials);
    } catch (error) {
        console.error("Error fetching saved tutorials: ", error);
        toast({
            title: "Error",
            description: "Could not fetch your saved tutorials.",
            variant: "destructive"
        })
    } finally {
        setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    loadSavedData();
  }, [loadSavedData]);

  const updateStatus = async (tutorialId: string, status: TutorialStatus) => {
    if (!user) return;
    const tutorialRef = doc(db, `users/${user.uid}/savedTutorials/${tutorialId}`);
    try {
      await updateDoc(tutorialRef, { status: status });
      setSavedTutorials(prev => prev.map(t => t.id === tutorialId ? {...t, status} : t));
      toast({
        title: 'Status Updated',
        description: `The status has been changed to "${status.replace('-', ' ')}".`,
      });
    } catch (error) {
        console.error("Error updating status: ", error);
        toast({
            title: "Error",
            description: "Could not update tutorial status.",
            variant: "destructive"
        })
    }
  };

  const removeTutorial = async (tutorialId: string, tutorialTitle: string) => {
    if (!user) return;
    const tutorialRef = doc(db, `users/${user.uid}/savedTutorials/${tutorialId}`);
    try {
        await deleteDoc(tutorialRef);
        setSavedTutorials(prev => prev.filter(t => t.id !== tutorialId));
        toast({
          title: 'Removed',
          description: `"${tutorialTitle}" has been removed from your saved list.`,
          variant: 'destructive',
        });
    } catch(error) {
        console.error("Error removing tutorial: ", error);
        toast({
            title: "Error",
            description: "Could not remove tutorial.",
            variant: "destructive"
        })
    }
  };
  
  if (isLoading) {
    return (
        <div className="container mx-auto px-4 py-8">
             <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-center">
                Your Saved Tutorials
                </h1>
            </header>
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
        </div>
    )
  }

  if (!user) {
    return (
         <div className="container mx-auto px-4 py-8">
            <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-center">
                Your Saved Tutorials
                </h1>
            </header>
            <div className="text-center py-20 bg-card border rounded-lg">
                <LogIn className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-semibold font-headline">Please Log In</h2>
                <p className="mt-2 text-muted-foreground">
                    You need to be logged in to view your saved tutorials.
                </p>
                <Button asChild className="mt-6">
                    <Link href="/login">Login</Link>
                </Button>
            </div>
        </div>
    )
  }


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
      
      {savedTutorials.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTutorials.map(tutorial => (
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
                 <Select value={tutorial.status} onValueChange={(value) => updateStatus(tutorial.id, value as TutorialStatus)}>
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
                <Button variant="outline" size="sm" onClick={() => updateStatus(tutorial.id, 'completed')} disabled={tutorial.status === 'completed'}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Completed
                </Button>
                <Button variant="destructive" size="sm" onClick={() => removeTutorial(tutorial.id, tutorial.title)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </CardFooter>
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
