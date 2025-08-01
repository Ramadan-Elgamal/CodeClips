
'use client';

import { useState } from 'react';
import { Submission } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { approveSubmission } from '@/ai/flows/addTutorialFlow';
import { deleteSubmission } from '@/lib/submissions';
import { Check, Trash2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function AdminDashboardClient({ initialSubmissions }: { initialSubmissions: Submission[] }) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleApprove = async (submission: Submission) => {
    setLoadingStates(prev => ({...prev, [submission.id]: true }));
    try {
      await approveSubmission(submission);
      setSubmissions(prev => prev.filter(s => s.id !== submission.id));
      toast({
        title: 'Approved!',
        description: `"${submission.title}" has been added to Notion and published.`,
      });
    } catch (error) {
      console.error("Failed to approve submission:", error);
      toast({
        title: 'Approval Failed',
        description: 'Could not add the tutorial to Notion. Check the logs.',
        variant: 'destructive',
      });
    } finally {
        setLoadingStates(prev => ({...prev, [submission.id]: false }));
    }
  };

  const handleReject = async (submission: Submission) => {
    setLoadingStates(prev => ({...prev, [submission.id]: true }));
    try {
      await deleteSubmission(submission.id);
      setSubmissions(prev => prev.filter(s => s.id !== submission.id));
      toast({
        title: 'Rejected',
        description: `"${submission.title}" has been rejected and deleted.`,
        variant: 'destructive',
      });
    } catch (error) {
      console.error("Failed to reject submission:", error);
      toast({
        title: 'Rejection Failed',
        description: 'Could not delete the submission from Firestore.',
        variant: 'destructive',
      });
    } finally {
        setLoadingStates(prev => ({...prev, [submission.id]: false }));
    }
  };
  
  if (submissions.length === 0) {
    return (
        <div className="text-center py-16 text-muted-foreground bg-card border rounded-lg">
          <h2 className="text-xl font-semibold font-headline">All Caught Up!</h2>
          <p>There are no pending submissions to review.</p>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      {submissions.map(submission => {
        const isLoading = loadingStates[submission.id];
        return (
          <Card key={submission.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-headline text-xl">{submission.title}</CardTitle>
                    <CardDescription>
                        <a href={submission.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline">
                           {submission.url} <ExternalLink className="h-4 w-4" />
                        </a>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                     <Badge variant="secondary">{submission.difficulty}</Badge>
                     <Badge variant="secondary">{submission.category}</Badge>
                     <Badge variant="secondary">{submission.language}</Badge>
                  </div>
              </div>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>View Details</AccordionTrigger>
                        <AccordionContent>
                           <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold">Summary</h4>
                                    <p className="text-muted-foreground">{submission.summary}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Tags</h4>
                                    <p className="text-muted-foreground">{submission.tags || 'None'}</p>
                                </div>
                                {submission.whatYoullLearn && (
                                    <div>
                                        <h4 className="font-semibold">What You'll Learn</h4>
                                        <p className="text-muted-foreground">{submission.whatYoullLearn}</p>
                                    </div>
                                )}
                                 {submission.contributorName && (
                                    <div>
                                        <h4 className="font-semibold">Submitted By</h4>
                                        <p className="text-muted-foreground">{submission.contributorName} {submission.contributorEmail && `(${submission.contributorEmail})`}</p>
                                    </div>
                                )}
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleReject(submission)} disabled={isLoading}>
                <Trash2 className="mr-2 h-4 w-4" />
                {isLoading ? 'Rejecting...' : 'Reject'}
              </Button>
              <Button onClick={() => handleApprove(submission)} disabled={isLoading}>
                <Check className="mr-2 h-4 w-4" />
                {isLoading ? 'Approving...' : 'Approve & Publish'}
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  );
}
