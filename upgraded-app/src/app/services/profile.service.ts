import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Profile } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);

  get(username: string): Observable<Profile> {
    return this.http.get<any>(`${environment.api}/profiles/${username}`).pipe(
      map(res => res.profile)
    );
  }

  follow(username: string): Observable<any> {
    return this.http.post<any>(`${environment.api}/profiles/${username}/follow`, {}).pipe(
      map(res => res.profile)
    );
  }

  unfollow(username: string): Observable<any> {
    return this.http.delete<any>(`${environment.api}/profiles/${username}/follow`).pipe(
      map(res => res.profile)
    );
  }
}
