
'use server';
/**
 * @fileOverview A flow to add a tutorial to the Notion database.
 * 
 * - approveSubmission - Takes submission data, adds it to Notion, and deletes the submission from Firestore.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Client } from '@notionhq/client';
import { deleteSubmission } from '@/lib/submissions';
import { Submission } from '@/lib/types';


const notionApiKey = process.env.NEXT_PUBLIC_NOTION_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID || '';

if (!notionApiKey) {
    throw new Error("NEXT_PUBLIC_NOTION_API_KEY is not set in environment variables.");
}

const notion = new Client({ auth: notionApiKey });


const SubmissionSchema = z.object({
  id: z.string(),
  url: z.string(),
  title: z.string(),
  summary: z.string(),
  whatYoullLearn: z.string().optional(),
  language: z.string(),
  category: z.string(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  tools: z.string().optional(),
  duration: z.string(),
  tags: z.string().optional(),
  contributorName: z.string().optional(),
  contributorEmail: z.string().optional(),
  submittedBy: z.string(),
  status: z.enum(['pending', 'approved', 'rejected']),
});

async function addTutorialToNotion(submission: Submission) {
    if (!databaseId) {
        throw new Error("NEXT_PUBLIC_NOTION_DATABASE_ID is not set.");
    }

    const tags = submission.tags ? submission.tags.split(',').map(tag => ({ name: tag.trim() })) : [];

    try {
        await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                Title: { title: [{ text: { content: submission.title } }] },
                URL: { url: submission.url },
                Summary: { rich_text: [{ text: { content: submission.summary } }] },
                Language: { select: { name: submission.language } },
                Category: { select: { name: submission.category } },
                Difficulty: { select: { name: submission.difficulty } },
                EstimatedTime: { select: { name: submission.duration } },
                Tags: { multi_select: tags },
                Status: { select: { name: 'Published' } },
                Type: { select: { name: 'video' } }, // Assuming video for now
            },
        });
    } catch (error) {
        console.error('Failed to create page in Notion:', error);
        throw new Error('Failed to create page in Notion.');
    }
}


export const approveSubmission = ai.defineFlow(
  {
    name: 'approveSubmissionFlow',
    inputSchema: SubmissionSchema,
    outputSchema: z.void(),
  },
  async (submission) => {
    await addTutorialToNotion(submission);
    await deleteSubmission(submission.id);
  }
);
