import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<string[]> {
    return this.http.get<any>(`${environment.api}/tags`).pipe(
      map(res => res.tags)
    );
  }
}
