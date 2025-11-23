export interface CampaignInput {
  productDescription: string;
  targetAudience: string;
}

export interface PostIdea {
  type: 'carousel' | 'reel' | 'static';
  title: string;
  caption: string;
  script?: string; // For Reels/Videos
  hook: string;
  cta: string;
  hashtags: string[];
  imagePrompt: string;
}

export interface CampaignOutput {
  contentPlan: string;
  posts: PostIdea[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO string
  type: 'carousel' | 'reel' | 'static';
  status: 'planned' | 'created' | 'posted';
  post: PostIdea;
}

export interface Campaign {
  id: string;
  name: string; // derived from product description or user input
  productDescription: string;
  targetAudience: string;
  contentPlan: string;
  posts: PostIdea[];
  created_at: string;
}
