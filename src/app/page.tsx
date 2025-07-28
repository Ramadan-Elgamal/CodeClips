
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowRight, Code, Video, BrainCircuit, Github, Twitter, Youtube, PlaySquare, LayoutGrid, PlayCircle, Bookmark, CheckCircle, Clock, BarChart3, FileText, ListVideo, List } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Tutorial } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

const categories = [
  {
    name: 'Frontend',
    description: 'Build beautiful and interactive user interfaces.',
    href: '/category/Frontend',
    icon: <Code className="w-8 h-8 text-primary" />,
  },
  {
    name: 'Backend',
    description: 'Power your applications with robust server-side logic.',
    href: '/category/Backend',
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
  },
  {
    name: 'Full Stack',
    description: 'Master both frontend and backend development.',
    href: '/category/Full%20Stack',
    icon: <Code className="w-8 h-8 text-primary" />,
  },
  {
    name: 'Mobile',
    description: 'Create amazing apps for iOS and Android.',
    href: '/category/Mobile',
    icon: <Video className="w-8 h-8 text-primary" />,
  },
];

function TutorialContent({ tutorial }: { tutorial: Tutorial }) {
    if (tutorial.imageUrl) {
        return (
             <Image
                src={tutorial.imageUrl}
                alt={tutorial.title}
                width={400}
                height={225}
                className="w-full h-full object-cover"
            />
        )
    }
    if (tutorial.type === 'video' && tutorial.youtubeId) {
        return (
            <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${tutorial.youtubeId}`}
                title={tutorial.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
            ></iframe>
        )
    }
    if (tutorial.type === 'playlist' && tutorial.playlistId) {
        return (
            <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/videoseries?list=${tutorial.playlistId}`}
                title={tutorial.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
            ></iframe>
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

function FeaturedTutorials() {
    const [tutorials, setTutorials] = useState<Tutorial[]>([]);

    useEffect(() => {
        fetch('/data.json')
            .then(res => res.json())
            .then((data: Tutorial[]) => {
                // simple logic to feature a few tutorials
                const featured = data.filter(t => t.tags.includes('React') || t.tags.includes('Next.js')).slice(0, 3);
                setTutorials(featured);
            });
    }, []);

    if (tutorials.length === 0) return null;

    return (
        <section id="featured" className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                Featured Projects
              </h2>
              <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
                Check out some of our top-rated project tutorials to get started.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tutorials.map((tutorial) => {
                 const TypeIcon = tutorial.type === 'playlist' ? List : tutorial.type === 'article' ? FileText : ListVideo;
                 return (
                  <Card key={tutorial.id} className="flex flex-col transition-transform transform hover:-translate-y-1 shadow-md hover:shadow-xl">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <Link href={`/tutorial/${tutorial.id}`} className="block pr-4">
                                <CardTitle className="font-headline text-xl leading-tight hover:text-primary transition-colors">{tutorial.title}</CardTitle>
                            </Link>
                             <div className="flex flex-col items-center">
                                <TypeIcon className="h-6 w-6 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground capitalize">{tutorial.type}</span>
                            </div>
                       </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <Link href={`/tutorial/${tutorial.id}`} className="block aspect-video mb-4 rounded-md overflow-hidden">
                        <TutorialContent tutorial={tutorial} />
                      </Link>
                      <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground"><BarChart3 className="h-4 w-4 text-accent" /><span className="font-medium text-foreground">{tutorial.difficulty}</span></div>
                          <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4 text-accent" /><span className="font-medium text-foreground">{tutorial.estimatedTime}</span></div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex-wrap gap-2">
                      {tutorial.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
                      ))}
                    </CardFooter>
                  </Card>
                 )
              })}
            </div>
          </div>
        </section>
    )
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-card">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                Learn to Code by Building Projects
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                CodeClips offers a curated collection of the best project-based coding tutorials on YouTube. Stop getting stuck in tutorial hell and start building your portfolio today.
              </p>
            </div>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                How It Works
              </h2>
              <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
                Getting started is simple. Follow these three easy steps to begin your learning journey.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <LayoutGrid className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold font-headline">1. Browse Tutorials</h3>
                <p className="text-muted-foreground">
                  Explore our curated list of tutorials by category or difficulty level to find the perfect project for you.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <PlayCircle className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold font-headline">2. Watch & Follow</h3>
                <p className="text-muted-foreground">
                  Watch the video tutorial and follow along directly on our site, with all the details you need in one place.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Bookmark className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold font-headline">3. Save Your Progress</h3>
                <p className="text-muted-foreground">
                  Save tutorials for later to build your personal learning library and track the projects you want to tackle.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="categories" className="w-full py-16 md:py-24 bg-card">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                Choose Your Path
              </h2>
              <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
                Whether you're just starting out or looking to specialize, we have a category for you.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Link key={category.name} href={category.href} className="group">
                  <Card className="h-full transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-xl">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      {category.icon}
                      <CardTitle className="font-headline text-xl">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{category.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        <section id="why-us" className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                Why CodeClips?
              </h2>
               <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
                We focus on providing the best experience for developers to learn and grow their skills.
              </p>
            </div>
            <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div className="flex items-start gap-4">
                  <CheckCircle className="w-7 h-7 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold font-headline">Curated Tutorials Only</h3>
                    <p className="text-muted-foreground mt-1">We hand-pick the best project-based tutorials to ensure quality and relevance.</p>
                  </div>
              </div>
               <div className="flex items-start gap-4">
                  <CheckCircle className="w-7 h-7 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold font-headline">Skill-based Filtering</h3>
                    <p className="text-muted-foreground mt-1">Find tutorials that match your skill level and programming language.</p>
                  </div>
              </div>
               <div className="flex items-start gap-4">
                  <CheckCircle className="w-7 h-7 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold font-headline">Save and Track Progress</h3>
                    <p className="text-muted-foreground mt-1">Keep a list of tutorials you want to watch and track what you've completed.</p>
                  </div>
              </div>
              <div className="flex items-start gap-4">
                  <CheckCircle className="w-7 h-7 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold font-headline">Always Free</h3>
                    <p className="text-muted-foreground mt-1">Our platform and all tutorials are completely free for everyone.</p>
                  </div>
              </div>
            </div>
          </div>
        </section>

        <FeaturedTutorials />

        <section className="w-full py-16 md:py-24 bg-card">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Ready to Start Building?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Dive into our collection of tutorials and bring your ideas to life. Your next project is just a click away.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
               <Button asChild size="lg">
                <Link href="#categories">
                  Choose your path
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-background border-t">
        <div className="container mx-auto py-12 px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
               <Link href="/" className="flex items-center space-x-2">
                <PlaySquare className="h-7 w-7 text-primary" />
                <span className="text-xl font-bold font-headline">
                  CodeClips
                </span>
              </Link>
              <p className="text-sm text-muted-foreground">Made by developers, for developers.</p>
            </div>
             <div>
              <h3 className="font-headline font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#categories" className="text-muted-foreground hover:text-foreground">Paths</Link></li>
                <li><Link href="/saved" className="text-muted-foreground hover:text-foreground">Saved Tutorials</Link></li>
                <li><Link href="/login" className="text-muted-foreground hover:text-foreground">Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-semibold mb-4">Contact</h3>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground"><Github className="w-6 h-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground"><Twitter className="w-6 h-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground"><Youtube className="w-6 h-6" /></Link>
              </div>
            </div>
             <div>
              <h3 className="font-headline font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} CodeClips. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
