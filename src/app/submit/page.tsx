
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function SubmitTutorialPage() {
    const [url, setUrl] = useState('');
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!url || !URL.canParse(url)) {
            toast({
                title: 'Invalid URL',
                description: 'Please enter a valid tutorial URL.',
                variant: 'destructive',
            });
            return;
        }
        
        console.log('Submitting URL:', url);
        toast({
            title: 'Tutorial Submitted!',
            description: 'Thanks for your submission. We will review it shortly.',
        });
        setUrl('');
    };

    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-headline">Submit a Tutorial</CardTitle>
                        <CardDescription>
                            Found a great project tutorial? Share it with the community!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="url">Tutorial URL</Label>
                                <Input 
                                    id="url" 
                                    type="url" 
                                    placeholder="https://youtube.com/watch?v=..." 
                                    required 
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Submit for Review
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
