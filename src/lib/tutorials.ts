import { Client } from '@notionhq/client';
import { Tutorial } from './types';
import 'dotenv/config'

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID || '';

function mapNotionResultToTutorial(result: any): Tutorial {
    const { properties } = result;
    return {
        id: result.id,
        title: properties.Title?.title?.[0]?.plain_text ?? 'Untitled',
        url: properties.URL?.url ?? '',
        imageUrl: properties.ImageURL?.url ?? undefined,
        type: properties.Type?.select?.name ?? 'article',
        summary: properties.Summary?.rich_text?.[0]?.plain_text ?? '',
        tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) ?? [],
        difficulty: properties.Difficulty?.select?.name ?? 'Beginner',
        language: properties.Language?.select?.name ?? 'JavaScript',
        category: properties.Category?.select?.name ?? 'Frontend',
        estimatedTime: properties.EstimatedTime?.select?.name ?? '1-2 hours',
    } as Tutorial;
}

export async function getAllTutorials(): Promise<Tutorial[]> {
    if (!databaseId) {
        console.error("NOTION_DATABASE_ID is not set.");
        return [];
    }
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                property: 'Status',
                select: {
                    equals: 'Published',
                },
            },
            sorts: [
                {
                    property: 'Title',
                    direction: 'ascending',
                },
            ],
        });
        return response.results.map(mapNotionResultToTutorial);
    } catch (error) {
        console.error("Failed to fetch tutorials from Notion", error);
        return [];
    }
}


export async function getTutorialsByCategory(category: string): Promise<Tutorial[]> {
     if (!databaseId) {
        console.error("NOTION_DATABASE_ID is not set.");
        return [];
    }
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                and: [
                    {
                        property: 'Category',
                        select: {
                            equals: category,
                        },
                    },
                    {
                        property: 'Status',
                        select: {
                            equals: 'Published',
                        },
                    }
                ],
            },
            sorts: [
                {
                    property: 'Title',
                    direction: 'ascending',
                },
            ],
        });
        return response.results.map(mapNotionResultToTutorial);
    } catch (error) {
        console.error(`Failed to fetch tutorials for category "${category}" from Notion`, error);
        return [];
    }
}


export async function getTutorialById(id: string): Promise<Tutorial | null> {
    try {
        const response = await notion.pages.retrieve({ page_id: id });
        return mapNotionResultToTutorial(response);
    } catch (error) {
        console.error(`Failed to fetch tutorial with ID "${id}" from Notion`, error);
        return null;
    }
}
