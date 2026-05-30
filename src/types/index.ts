export interface User {
  id: string;
  email: string;
  anonymousName: string;
}

export interface Post {
  id: string;
  content: string;
  createdAt: string;
  expiresAt: string;
  anonymousName: string;
  likesCount: number;
  isLiked: boolean;
}

export interface FeedResponse {
  posts: Post[];
  nextCursor?: string;
}

export interface Notification {
  id: string;
  createdAt: string;
  post: {
    id: string;
    content: string;
  };
  likerName: string;
}
export interface UserReport {
  id: string;
  postId: string;
  postContent: string;
  postAuthor: string;
  reason: string;
  status: 'pending' | 'resolved' | 'rejected';
  adminNote?: string;
  createdAt: string;
}
