
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Tag, Clock, BarChart3, Code, Info } from 'lucide-react';

export default function HomePage() {
  const [allTutorials, setAllTutorials] = useState<Tutorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');

  const safeGetLocalStorage = (key: string, defaultValue: string) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key) || defaultValue;
    }
    return defaultValue;
  };

  useEffect(() => {
    setDifficultyFilter(safeGetLocalStorage('difficultyFilter', 'all'));
    setCategoryFilter(safeGetLocalStorage('categoryFilter', 'all'));
    setLanguageFilter(safeGetLocalStorage('languageFilter', 'all'));
  }, []);

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

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>, key: string) => (value: string) => {
      setter(value);
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    };

  const filteredTutorials = useMemo(() => {
    return allTutorials.filter((tutorial) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        tutorial.title.toLowerCase().includes(searchLower) ||
        tutorial.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      const matchesDifficulty =
        difficultyFilter === 'all' || tutorial.difficulty === difficultyFilter;

      const matchesCategory =
        categoryFilter === 'all' || tutorial.category === categoryFilter;
      
      const matchesLanguage =
        languageFilter === 'all' || tutorial.language === languageFilter;

      return matchesSearch && matchesDifficulty && matchesCategory && matchesLanguage;
    });
  }, [searchQuery, difficultyFilter, categoryFilter, languageFilter, allTutorials]);

  const uniqueCategories = useMemo(() => ['all', ...Array.from(new Set(allTutorials.map(t => t.category)))], [allTutorials]);
  const uniqueLanguages = useMemo(() => ['all', ...Array.from(new Set(allTutorials.map(t => t.language)))], [allTutorials]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
          Find Your Next Coding Project
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Browse our curated list of high-quality YouTube tutorials to build amazing applications and level up your skills.
        </p>
      </header>

      <div className="mb-8 p-6 bg-card rounded-lg shadow-sm">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title or tag..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={categoryFilter} onValueChange={handleFilterChange(setCategoryFilter, 'categoryFilter')}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {uniqueCategories.map(category => (
                <SelectItem key={category} value={category}>{category === 'all' ? 'All Categories' : category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={difficultyFilter} onValueChange={handleFilterChange(setDifficultyFilter, 'difficultyFilter')}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
           <Select value={languageFilter} onValueChange={handleFilterChange(setLanguageFilter, 'languageFilter')}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by language" />
            </SelectTrigger>
            <SelectContent>
               {uniqueLanguages.map(lang => (
                <SelectItem key={lang} value={lang}>{lang === 'all' ? 'All Languages' : lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
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
      ) : filteredTutorials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTutorials.map((tutorial) => (
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
          <p className="text-lg font-medium">No tutorials found.</p>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
