
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldX, Check, X } from 'lucide-react';
import { approveSubmission } from '@/ai/flows/approveSubmissionFlow';
import { Badge } from '@/components/ui/badge';

interface Submission {
    id: string;
    [key: string]: any;
}

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!loading && user?.uid !== process.env.NEXT_PUBLIC_ADMIN_UID) {
            toast({
                title: "Unauthorized",
                description: "You do not have permission to view this page.",
                variant: "destructive"
            });
            router.push('/');
        }
    }, [user, loading, router, toast]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            if (user?.uid === process.env.NEXT_PUBLIC_ADMIN_UID) {
                try {
                    const querySnapshot = await getDocs(collection(db, 'submissions'));
                    const subs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setSubmissions(subs);
                } catch (error) {
                    console.error("Error fetching submissions: ", error);
                    toast({
                        title: "Error",
                        description: "Could not fetch submissions.",
                        variant: "destructive",
                    });
                } finally {
                    setIsLoading(false);
                }
            }
        };

        if (!loading && user) {
            fetchSubmissions();
        }
    }, [user, loading, toast]);

    const handleApprove = async (submission: Submission) => {
        setIsProcessing(prev => ({...prev, [submission.id]: true}));
        try {
            await approveSubmission(submission);
            toast({
                title: "Success!",
                description: `Tutorial "${submission.title}" has been approved and added.`,
            });
            setSubmissions(prev => prev.filter(s => s.id !== submission.id));
        } catch (error) {
            console.error("Failed to approve submission", error);
            toast({
                title: "Approval Failed",
                description: "Something went wrong while approving the tutorial.",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(prev => ({...prev, [submission.id]: false}));
        }
    };
    
    const handleReject = async (submissionId: string, submissionTitle: string) => {
        setIsProcessing(prev => ({...prev, [submissionId]: true}));
        try {
            await deleteDoc(doc(db, "submissions", submissionId));
            toast({
                title: "Rejected",
                description: `Submission "${submissionTitle}" has been rejected and deleted.`,
            });
            setSubmissions(prev => prev.filter(s => s.id !== submissionId));
        } catch (error) {
            console.error("Failed to reject submission", error);
            toast({
                title: "Rejection Failed",
                description: "Something went wrong.",
                variant: "destructive",
            });
        } finally {
             setIsProcessing(prev => ({...prev, [submissionId]: false}));
        }
    };


    if (loading || isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    if (user?.uid !== process.env.NEXT_PUBLIC_ADMIN_UID) {
        return (
             <div className="text-center py-20 bg-card border rounded-lg">
                <ShieldX className="mx-auto h-12 w-12 text-destructive" />
                <h2 className="mt-4 text-xl font-semibold font-headline">Access Denied</h2>
                <p className="mt-2 text-muted-foreground">
                    You do not have permission to view this page.
                </p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-4">Review and approve new tutorial submissions.</p>
            </header>

            {submissions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {submissions.map(sub => (
                        <Card key={sub.id}>
                            <CardHeader>
                                <CardTitle>{sub.title}</CardTitle>
                                <CardDescription>
                                    <a href={sub.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                                        {sub.url}
                                    </a>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                               <p><strong className="font-medium">Summary:</strong> {sub.summary}</p>
                               <p><strong className="font-medium">Category:</strong> <Badge variant="secondary">{sub.category}</Badge></p>
                               <p><strong className="font-medium">Difficulty:</strong> <Badge variant="secondary">{sub.difficulty}</Badge></p>
                               <p><strong className="font-medium">Language:</strong> <Badge variant="secondary">{sub.language}</Badge></p>
                               <p><strong className="font-medium">Tags:</strong> {sub.tags}</p>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleReject(sub.id, sub.title)}
                                    disabled={isProcessing[sub.id]}
                                >
                                    <X className="mr-2 h-4 w-4" /> Reject
                                </Button>
                                <Button 
                                    size="sm"
                                    onClick={() => handleApprove(sub)}
                                    disabled={isProcessing[sub.id]}
                                >
                                    {isProcessing[sub.id] ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Check className="mr-2 h-4 w-4" />}
                                    Approve
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-card border rounded-lg">
                    <h2 className="mt-4 text-xl font-semibold font-headline">No Pending Submissions</h2>
                    <p className="mt-2 text-muted-foreground">
                        All caught up! There are no new tutorials to review.
                    </p>
                </div>
            )}

        </div>
    );
}
