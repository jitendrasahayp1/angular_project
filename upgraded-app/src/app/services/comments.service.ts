import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private readonly http = inject(HttpClient);

  add(slug: string, payload: string): Observable<Comment> {
    return this.http.post<any>(`${environment.api}/articles/${slug}/comments`, {
      comment: { body: payload }
    }).pipe(
      map(res => res.comment)
    );
  }

  getAll(slug: string): Observable<Comment[]> {
    return this.http.get<any>(`${environment.api}/articles/${slug}/comments`).pipe(
      map(res => res.comments)
    );
  }

  destroy(commentId: number, articleSlug: string): Observable<any> {
    return this.http.delete(`${environment.api}/articles/${articleSlug}/comments/${commentId}`);
  }
}
