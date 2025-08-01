
export interface Tutorial {
  id: string;
  title: string;
  url: string;
  imageUrl?: string;
  type: 'video' | 'playlist' | 'article';
  summary: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  category: string;
  estimatedTime: string;
}
