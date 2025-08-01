

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

export interface Submission {
  id: string;
  url: string;
  title: string;
  summary: string;
  whatYoullLearn?: string;
  language: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tools?: string;
  duration: string;
  tags?: string;
  contributorName?: string;
  contributorEmail?: string;
  submittedBy: string;
  status: 'pending' | 'approved' | 'rejected';
}
