
export interface Tutorial {
  id: string;
  title: string;
  youtubeId: string;
  summary: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  category: string;
  estimatedTime: string;
  prerequisites: string[];
  timestamps?: { time: string; description: string }[];
}
