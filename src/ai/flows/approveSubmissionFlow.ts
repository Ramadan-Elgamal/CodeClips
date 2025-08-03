
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Client } from '@notionhq/client';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

const notionApiKey = process.env.NOTION_API_KEY;
const databaseId = process.env.NOTION_DATABASE_ID || '';

if (!notionApiKey) {
    throw new Error("NOTION_API_KEY is not set in environment variables.");
}
if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID is not set in environment variables.");
}

const notion = new Client({ auth: notionApiKey });

const SubmissionSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  title: z.string(),
  summary: z.string(),
  language: z.string(),
  category: z.string(),
  difficulty: z.string(),
  duration: z.string(),
  tags: z.string().optional(),
});

type Submission = z.infer<typeof SubmissionSchema>;

// This function will be called from the Admin UI
export async function approveSubmission(submission: Submission): Promise<void> {
  await approveSubmissionFlow(submission);
}

const approveSubmissionFlow = ai.defineFlow(
  {
    name: 'approveSubmissionFlow',
    inputSchema: SubmissionSchema,
    outputSchema: z.void(),
  },
  async (submission) => {
    // 1. Add the approved tutorial to the Notion database
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        'Title': { title: [{ text: { content: submission.title } }] },
        'URL': { url: submission.url },
        'Summary': { rich_text: [{ text: { content: submission.summary } }] },
        'Language': { select: { name: submission.language } },
        'Category': { select: { name: submission.category } },
        'Difficulty': { select: { name: submission.difficulty } },
        'EstimatedTime': { select: { name: submission.duration } },
        'Tags': { multi_select: submission.tags ? submission.tags.split(',').map(tag => ({ name: tag.trim() })) : [] },
        'Status': { select: { name: 'Published' } },
        'Type': { select: { name: 'video' } }, // Assuming all submissions are videos for now
      },
    });

    // 2. Delete the original submission from the 'submissions' collection in Firestore
    await deleteDoc(doc(db, 'submissions', submission.id));
  }
);
