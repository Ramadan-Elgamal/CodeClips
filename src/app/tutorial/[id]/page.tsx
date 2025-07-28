
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Tutorial } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Bookmark, Clock, BarChart3, Code, CheckCircle, Info, ArrowLeft, Layers, ListVideo, ExternalLink, FileText, List } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function getYouTubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function getPlaylistId(url: string): string | null {
    const regExp = /[?&]list=([^#&?]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

function TutorialContent({ tutorial }: { tutorial: Tutorial }) {
  const videoId = tutorial.type === 'video' ? getYouTubeId(tutorial.url) : null;
  const playlistId = tutorial.type === 'playlist' ? getPlaylistId(tutorial.url) : null;

  if (tutorial.type === 'video' && videoId) {
    return (
      <div className="aspect-video w-full mb-8 rounded-lg overflow-hidden shadow-lg">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={tutorial.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }
  if (tutorial.type === 'playlist' && playlistId) {
    return (
      <div className="aspect-video w-full mb-8 rounded-lg overflow-hidden shadow-lg">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/videoseries?list=${playlistId}`}
          title={tutorial.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }
   if (tutorial.type === 'article') {
    return (
        <div className="bg-card p-8 rounded-lg border shadow-lg mb-8 text-center">
            <FileText className="h-16 w-16 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-headline font-semibold mb-2">This is an Article</h2>
            <p className="text-muted-foreground mb-6">This content is best viewed on its original page.</p>
            <Button asChild>
                <a href={tutorial.url} target="_blank" rel="noopener noreferrer">
                    Read Article
                    <ExternalLink className="ml-2 h-4 w-4" />
                </a>
            </Button>
      </div>
    );
  }
  
  const imageUrl = tutorial.imageUrl || `https://placehold.co/1280x720.png`;

  return (
      <div className="aspect-video w-full mb-8 rounded-lg overflow-hidden shadow-lg relative">
          <Image
              src={imageUrl}
              alt={tutorial.title}
              layout="fill"
              objectFit="cover"
              data-ai-hint="article hero image"
          />
           <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <a href={tutorial.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white text-lg bg-black/50 px-4 py-2 rounded-md hover:bg-black/70 transition-colors">
                  <ExternalLink className="h-5 w-5" />
                  View Content
              </a>
          </div>
      </div>
  );
}


export default function TutorialDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchTutorial = async () => {
      try {
        const response = await fetch('/data.json');
        if (!response.ok) throw new Error('Failed to load tutorial data.');
        const tutorials: Tutorial[] = await response.json();
        const currentTutorial = tutorials.find((t) => t.id === id);
        if (currentTutorial) {
          setTutorial(currentTutorial);
        } else {
          throw new Error('Tutorial not found.');
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutorial();
  }, [id]);

  useEffect(() => {
    if (typeof window !== 'undefined' && tutorial) {
      const savedTutorials: string[] = JSON.parse(localStorage.getItem('savedTutorials') || '[]');
      setIsSaved(savedTutorials.includes(tutorial.id));
    }
  }, [tutorial]);

  const toggleSave = () => {
    if (!tutorial) return;
    const savedTutorials: string[] = JSON.parse(localStorage.getItem('savedTutorials') || '[]');
    let updatedSaved: string[];
    if (isSaved) {
      updatedSaved = savedTutorials.filter((savedId) => savedId !== tutorial.id);
      toast({
        title: "Removed from Saved",
        description: `"${tutorial.title}" has been removed from your saved tutorials.`,
      });
    } else {
      updatedSaved = [...savedTutorials, tutorial.id];
      toast({
        title: "Saved!",
        description: `"${tutorial.title}" has been added to your saved tutorials.`,
      });
    }
    localStorage.setItem('savedTutorials', JSON.stringify(updatedSaved));
    setIsSaved(!isSaved);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-1/4 mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <div className="aspect-video w-full mb-8">
            <Skeleton className="w-full h-full" />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="space-y-4">
                 <Skeleton className="h-6 w-1/2 mb-4" />
                 <Skeleton className="h-5 w-full" />
                 <Skeleton className="h-5 w-full" />
                 <Skeleton className="h-5 w-full" />
            </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-16 text-destructive">{error}</div>;
  }
  
  if (!tutorial) {
      return null;
  }
  
  const TutorialIcon = tutorial.type === 'playlist' ? List : tutorial.type === 'article' ? FileText : ListVideo;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href={`/category/${encodeURIComponent(tutorial.category)}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to {tutorial.category}
      </Link>
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-4 mb-2 sm:mb-0">
                <TutorialIcon className="h-8 w-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">{tutorial.title}</h1>
            </div>
            <Badge variant="outline" className="text-sm capitalize w-fit">{tutorial.type}</Badge>
        </div>
      </header>

      <TutorialContent tutorial={tutorial} />

      <div className="grid md:grid-cols-3 gap-x-12 gap-y-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-headline font-semibold border-b pb-2 mb-4">About this tutorial</h2>
          <p className="text-foreground/80 leading-relaxed">{tutorial.summary}</p>
        </div>
        <div className="row-start-3 md:row-auto">
            <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-headline font-semibold mb-4">Details</h3>
                <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3"><BarChart3 className="h-5 w-5 text-accent flex-shrink-0" /> <span><strong>Difficulty:</strong> {tutorial.difficulty}</span></li>
                    <li className="flex items-center gap-3"><Code className="h-5 w-5 text-accent flex-shrink-0" /> <span><strong>Language:</strong> {tutorial.language}</span></li>
                    <li className="flex items-center gap-3"><Clock className="h-5 w-5 text-accent flex-shrink-0" /> <span><strong>Time:</strong> {tutorial.estimatedTime}</span></li>
                </ul>
                <Button onClick={toggleSave} className="w-full mt-6">
                    {isSaved ? <CheckCircle className="mr-2 h-4 w-4" /> : <Bookmark className="mr-2 h-4 w-4" />}
                    {isSaved ? 'Saved for Later' : 'Save for Later'}
                </Button>
            </div>
        </div>

        {tutorial.timestamps && tutorial.timestamps.length > 0 && tutorial.type !== 'article' && (
          <div className="md:col-span-2">
            <h2 className="text-2xl font-headline font-semibold border-b pb-2 mb-4 flex items-center gap-2">
              <ListVideo className="h-6 w-6" />
              Timestamps
            </h2>
            <ul className="space-y-2">
              {tutorial.timestamps.map((timestamp, index) => (
                <li key={index} className="flex gap-4 items-start text-sm">
                  <span className="font-mono text-muted-foreground w-16 text-right shrink-0">{timestamp.time}</span>

                  <span className="font-medium">{timestamp.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tutorial.tags.length > 0 && (
            <div className="md:col-span-2">
                <h2 className="text-2xl font-headline font-semibold border-b pb-2 mb-4 flex items-center gap-2">
                  <Layers className="h-6 w-6" />
                  Stack Used
                </h2>
                <div className="flex flex-wrap gap-2">
                    {tutorial.tags.map(tag => <Badge key={tag} variant="secondary" className="text-sm py-1 px-3">{tag}</Badge>)}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
