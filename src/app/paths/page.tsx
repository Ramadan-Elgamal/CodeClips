
import { categories } from '@/lib/data';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function PathsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
          Learning Paths
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Choose a path that aligns with your goals and interests. Each path is a curated collection of tutorials.
        </p>
      </header>
       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}
