
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, XCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';


const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

const submitTutorialSchema = z.object({
  url: z.string().url().regex(youtubeUrlRegex, 'Please enter a valid YouTube URL.'),
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  summary: z.string().min(20, 'Summary must be at least 20 characters long.'),
  language: z.string().min(1, "Please select a language."),
  category: z.string().min(1, "Please select a category."),
  difficulty: z.string().min(1, "Please select a difficulty level."),
  duration: z.coerce.number().min(0, "Duration must be a positive number."),
  tags: z.string().optional(),
  // Fields not in the approval schema but useful for submission context
  tools: z.string().optional(),
  contributorName: z.string().optional(),
  contributorEmail: z.string().email('Please enter a valid email.').optional().or(z.literal('')),
});


type SubmitTutorialForm = z.infer<typeof submitTutorialSchema>;

export default function SubmitTutorialPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    register, 
    handleSubmit, 
    control,
    reset,
    formState: { errors, isSubmitting } 
  } = useForm<SubmitTutorialForm>({
    resolver: zodResolver(submitTutorialSchema),
  });

  const onSubmit = async (data: SubmitTutorialForm) => {
    try {
      const submissionData = {
        ...data,
        submittedAt: serverTimestamp(),
        status: 'pending',
        submittedBy: user ? user.uid : 'anonymous',
      };
      
      await addDoc(collection(db, 'submissions'), submissionData);

      toast({
        title: 'Tutorial Submitted!',
        description: 'Thanks! We’ll review your tutorial and publish it if it meets the guidelines.',
      });
      reset();
    } catch (error) {
      console.error("Error submitting tutorial: ", error);
      toast({
        title: 'Submission Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-headline">Submit a Tutorial</CardTitle>
              <CardDescription>
                Help others learn by sharing a great coding project tutorial. All submissions are reviewed before being published.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="space-y-2">
                  <Label htmlFor="url">YouTube URL</Label>
                  <Input id="url" placeholder="https://youtube.com/watch?v=..." {...register('url')} />
                  {errors.url && <p className="text-sm text-destructive">{errors.url.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input id="title" placeholder="e.g., Build a To-Do App with React" {...register('title')} />
                  {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea id="summary" placeholder="Describe what this tutorial builds and why it's useful." {...register('summary')} />
                  {errors.summary && <p className="text-sm text-destructive">{errors.summary.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="language">Programming Language</Label>
                        <Controller
                            name="language"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger id="language"><SelectValue placeholder="Select language..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="JavaScript">JavaScript</SelectItem>
                                        <SelectItem value="Python">Python</SelectItem>
                                        <SelectItem value="Dart">Dart</SelectItem>
                                        <SelectItem value="TypeScript">TypeScript</SelectItem>
                                        <SelectItem value="Java">Java</SelectItem>
                                        <SelectItem value="Go">Go</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                         {errors.language && <p className="text-sm text-destructive">{errors.language.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Topic/Category</Label>
                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger id="category"><SelectValue placeholder="Select category..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Frontend">Frontend</SelectItem>
                                        <SelectItem value="Backend">Backend</SelectItem>
                                        <SelectItem value="Full Stack">Full Stack</SelectItem>
                                        <SelectItem value="Mobile">Mobile</SelectItem>
                                        <SelectItem value="AI/ML">AI/ML</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Controller
                            name="difficulty"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger id="difficulty"><SelectValue placeholder="Select difficulty..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.difficulty && <p className="text-sm text-destructive">{errors.difficulty.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="duration">Estimated Duration (hours)</Label>
                        <Input id="duration" type="number" placeholder="e.g., 5" {...register('duration')} />
                        {errors.duration && <p className="text-sm text-destructive">{errors.duration.message}</p>}
                    </div>
                </div>
                
                 <div className="space-y-2">
                  <Label htmlFor="tools">Tools/Libraries Used</Label>
                  <Input id="tools" placeholder="e.g., React, Flask, Tailwind CSS, Firebase" {...register('tools')} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input id="tags" placeholder="e.g., react, crud, api, authentication" {...register('tags')} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contributorName">Your Name (Optional)</Label>
                      <Input id="contributorName" placeholder="For attribution" {...register('contributorName')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contributorEmail">Your Email (Optional)</Label>
                      <Input id="contributorEmail" placeholder="For questions (not shown publicly)" {...register('contributorEmail')} />
                      {errors.contributorEmail && <p className="text-sm text-destructive">{errors.contributorEmail.message}</p>}
                    </div>
                </div>

                <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Tutorial'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <aside className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Submission Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span>Project-focused: The tutorial should guide viewers in building a specific, tangible project.</span>
                        </li>
                         <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span>Clear audio and video quality.</span>
                        </li>
                         <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span>Code is functional and leads to a working result.</span>
                        </li>
                          <li className="flex items-start">
                            <XCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span>No theory-only videos or pure slideshows.</span>
                        </li>
                         <li className="flex items-start">
                            <XCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span>No overly promotional or clickbait content.</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </aside>

      </div>
    </div>
  );
}
