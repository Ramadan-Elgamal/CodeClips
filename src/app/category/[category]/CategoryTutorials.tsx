
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, BarChart3, Code, Bookmark, CheckCircle, FilterX, ChevronLeft, ChevronRight, ListVideo, List, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const TUTORIALS_PER_PAGE = 6;

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

export default function CategoryTutorials({ initialTutorials }: { initialTutorials: Tutorial[] }) {
  const { toast } = useToast();
  const [tutorials, setTutorials] = useState<Tutorial[]>(initialTutorials);
  const [isLoading, setIsLoading] = useState(false); // No longer loading initially
  const [savedTutorials, setSavedTutorials] = useState<Set<string>>(new Set());

  // State for sorting and filtering
  const [sortOption, setSortOption] = useState('title-asc');
  const [filters, setFilters] = useState({ difficulty: 'all', language: 'all' });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedIds = JSON.parse(localStorage.getItem('savedTutorials') || '[]');
      setSavedTutorials(new Set(savedIds));
    }
  }, []);

  const toggleSave = (tutorial: Tutorial) => {
    const newSavedTutorials = new Set(savedTutorials);
    if (newSavedTutorials.has(tutorial.id)) {
      newSavedTutorials.delete(tutorial.id);
      toast({
        title: 'Removed from Saved',
        description: `"${tutorial.title}" has been removed from your saved tutorials.`,
      });
    } else {
      newSavedTutorials.add(tutorial.id);
      toast({
        title: 'Saved!',
        description: `"${tutorial.title}" has been added to your saved tutorials.`,
      });
    }
    setSavedTutorials(newSavedTutorials);
    localStorage.setItem('savedTutorials', JSON.stringify(Array.from(newSavedTutorials)));
  };

  const clearFilters = () => {
    setFilters({ difficulty: 'all', language: 'all' });
    setCurrentPage(1);
  };
  
  const availableLanguages = useMemo(() => {
    const languages = new Set(tutorials.map(t => t.language));
    return Array.from(languages).sort();
  }, [tutorials]);

  const filteredAndSortedTutorials = useMemo(() => {
    let result = [...tutorials];

    // Filtering
    if (filters.difficulty !== 'all') {
        result = result.filter(t => t.difficulty === filters.difficulty);
    }
    if (filters.language !== 'all') {
        result = result.filter(t => t.language === filters.language);
    }

    // Sorting
    switch (sortOption) {
        case 'title-asc':
            result.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'title-desc':
            result.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'difficulty-asc':
            const diffOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
            result.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
            break;
        case 'difficulty-desc':
            const diffOrderDesc = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
            result.sort((a, b) => diffOrderDesc[b.difficulty] - diffOrderDesc[a.difficulty]);
            break;
    }

    return result;
  }, [tutorials, sortOption, filters]);

  const totalPages = Math.ceil(filteredAndSortedTutorials.length / TUTORIALS_PER_PAGE);

  const paginatedTutorials = useMemo(() => {
    const startIndex = (currentPage - 1) * TUTORIALS_PER_PAGE;
    const endIndex = startIndex + TUTORIALS_PER_PAGE;
    return filteredAndSortedTutorials.slice(startIndex, endIndex);
  }, [filteredAndSortedTutorials, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortOption, filters]);

  return (
    <>
      <div className="bg-card border rounded-lg p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="grid gap-1.5">
                <Label htmlFor="sort">Sort by</Label>
                <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger id="sort">
                        <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                        <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                        <SelectItem value="difficulty-asc">Difficulty (Easy to Hard)</SelectItem>
                        <SelectItem value="difficulty-desc">Difficulty (Hard to Easy)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="filter-difficulty">Difficulty</Label>
                <Select value={filters.difficulty} onValueChange={(value) => setFilters(f => ({...f, difficulty: value}))}>
                    <SelectTrigger id="filter-difficulty">
                        <SelectValue placeholder="Filter by difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="grid gap-1.5">
                <Label htmlFor="filter-language">Language</Label>
                <Select value={filters.language} onValueChange={(value) => setFilters(f => ({...f, language: value}))}>
                    <SelectTrigger id="filter-language">
                        <SelectValue placeholder="Filter by language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Languages</SelectItem>
                        {availableLanguages.map(lang => (
                            <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button variant="ghost" onClick={clearFilters} className="w-full md:w-auto">
                <FilterX className="mr-2 h-4 w-4"/>
                Clear Filters
            </Button>
        </div>
      </div>

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
      ) : paginatedTutorials.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedTutorials.map((tutorial) => {
              const isSaved = savedTutorials.has(tutorial.id);
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
                <CardFooter className="flex-wrap gap-2 justify-between items-center">
                   <div className="flex flex-wrap gap-2">
                      {tutorial.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
                      ))}
                   </div>
                   <Button variant="outline" size="sm" onClick={() => toggleSave(tutorial)}>
                    {isSaved ? <CheckCircle className="mr-2 h-4 w-4 text-primary" /> : <Bookmark className="mr-2 h-4 w-4" />}
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                </CardFooter>
              </Card>
              );
            })}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-12">
                <Button 
                    variant="outline" 
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                </span>
                <Button 
                    variant="outline" 
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
           )}
        </>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">No tutorials found for this category.</p>
          <p>This could be because no tutorials are published in this category yet, or there was an issue fetching them.</p>
        </div>
      )}
    </>
  );
}
