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
