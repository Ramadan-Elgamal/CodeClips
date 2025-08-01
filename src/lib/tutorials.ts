
import { Client } from '@notionhq/client';
import { Tutorial } from './types';

const notionApiKey = process.env.NEXT_PUBLIC_NOTION_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID || '';

if (!notionApiKey) {
    throw new Error("NEXT_PUBLIC_NOTION_API_KEY is not set in environment variables.");
}

const notion = new Client({ auth: notionApiKey });

function getYouTubeVideoId(url: string): string | null {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.slice(1);
        }
        if (urlObj.hostname.includes('youtube.com')) {
            return urlObj.searchParams.get('v');
        }
    } catch (error) {
        // Was not a valid URL
    }
    return null;
}

function mapNotionResultToTutorial(result: any): Tutorial {
    const { properties } = result;

    let imageUrl = properties.ImageURL?.url ?? undefined;
    const videoUrl = properties.URL?.url ?? '';
    
    // If no image is provided, try to generate one from the YouTube URL
    if (!imageUrl && videoUrl) {
        const videoId = getYouTubeVideoId(videoUrl);
        if (videoId) {
            // Use high-quality thumbnail
            imageUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
        }
    } else if (imageUrl && imageUrl.includes('ytimg.com')) {
        // If an image URL is provided and it's from YouTube, upgrade its quality.
        // This replaces things like `default.jpg` or `hqdefault.jpg` with the best version.
        const videoId = imageUrl.split('/')[4];
        if (videoId) {
             imageUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
        }
    }

    return {
        id: result.id,
        title: properties.Title?.title?.[0]?.plain_text ?? 'Untitled',
        url: properties.URL?.url ?? '',
        imageUrl: imageUrl,
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
        console.error("NEXT_PUBLIC_NOTION_DATABASE_ID is not set.");
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
        console.error("NEXT_PUBLIC_NOTION_DATABASE_ID is not set.");
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
