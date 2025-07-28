
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Code, Video, BrainCircuit } from 'lucide-react';

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
                <Link href="/tutorials">
                  Explore All Tutorials
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
                <Link href="/tutorials">
                  View All Projects
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
