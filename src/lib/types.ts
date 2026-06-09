export type Platform = 'instagram' | 'tiktok' | 'facebook' | 'twitter' | 'linkedin'

export type SubscriptionStatus = 'free' | 'pro' | 'enterprise';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  credits: number;
  stripe_customer_id?: string;
  subscription_status: SubscriptionStatus;
  created_at: string;
}

export interface ContentHistory {
  id: string;
  user_id: string;
  topic: string;
  niche: string;
  platform: string;
  caption?: string;
  hashtags?: any;
  post_ideas?: any;
  created_at: string;
}

export interface GenerateRequest {
  topic: string;
  niche: string;
  platform: string;
}

export interface GenerateResponse {
  caption: string;
  hashtags: string[];
  post_ideas: string[];
}