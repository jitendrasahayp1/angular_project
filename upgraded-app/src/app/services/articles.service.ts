import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Article, ArticleListConfig, ArticleListResponse } from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private readonly http = inject(HttpClient);

  query(config: ArticleListConfig): Observable<ArticleListResponse> {
    const url = `${environment.api}/articles${config.type === 'feed' ? '/feed' : ''}`;
    let params = new HttpParams();
    if (config.filters) {
      Object.keys(config.filters).forEach(key => {
        if (config.filters![key] !== undefined && config.filters![key] !== null) {
          params = params.set(key, config.filters![key]);
        }
      });
    }
    return this.http.get<ArticleListResponse>(url, { params });
  }

  get(slug: string): Observable<Article> {
    if (!slug.replace(' ', '')) {
      return throwError(() => new Error('Article slug is empty'));
    }
    return this.http.get<any>(`${environment.api}/articles/${slug}`).pipe(
      map(res => res.article)
    );
  }

  destroy(slug: string): Observable<any> {
    return this.http.delete(`${environment.api}/articles/${slug}`);
  }

  save(article: any): Observable<Article> {
    if (article.slug) {
      const slug = article.slug;
      const articleData = { ...article };
      delete articleData.slug;
      return this.http.put<any>(`${environment.api}/articles/${slug}`, { article: articleData }).pipe(
        map(res => res.article)
      );
    } else {
      return this.http.post<any>(`${environment.api}/articles`, { article }).pipe(
        map(res => res.article)
      );
    }
  }

  favorite(slug: string): Observable<any> {
    return this.http.post(`${environment.api}/articles/${slug}/favorite`, {});
  }

  unfavorite(slug: string): Observable<any> {
    return this.http.delete(`${environment.api}/articles/${slug}/favorite`);
  }
}
