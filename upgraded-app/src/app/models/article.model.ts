import { Profile } from './profile.model';

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Profile;
}

export interface ArticleListConfig {
  type: string;
  filters?: { [key: string]: any };
  currentPage?: number;
  totalPages?: number;
}

export interface ArticleListResponse {
  articles: Article[];
  articlesCount: number;
}
