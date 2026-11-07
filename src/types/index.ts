export interface CreatorChannel {
  id: string;
  channelId: string;
  title: string;
  customUrl?: string;
  thumbnailUrl?: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  niche?: string;
  isPrimary: boolean;
}

export interface CreatorProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  tier: "Free" | "Pro" | "Enterprise";
}
