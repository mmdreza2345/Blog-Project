export type Status = "Published" | "Draft";

export interface ArticleInput {
  title: string;
  category: string;
  content: string;
  image: string;
  status: Status;
}

export interface Blog extends ArticleInput {
  id: number;
  authorId: number;
  author: string;
  avatar: string;
  excerpt: string;
  readingTime: string;
  publishedAt: string | null;
  views: number;
  likes: number;
  comments: number;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  count: number;
}

export interface Profile {
  id: number;
  name: string;
  email: string;
  username: string;
  bio: string;
  website: string;
  location: string;
  avatar: string;
  joinedAt: string;
}

export interface ArticleComment {
  id: number;
  author: string;
  body: string;
}
