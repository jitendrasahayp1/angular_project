import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, map, catchError, switchMap } from 'rxjs';
import { JwtService } from './jwt.service';
import { environment } from '../../environments/environment';

export interface User {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly jwtService = inject(JwtService);

  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  get current(): User | null {
    return this.currentUserSubject.value;
  }

  attemptAuth(type: string, credentials: any): Observable<any> {
    const route = (type === 'login') ? '/login' : '';
    return this.http.post<any>(`${environment.api}/users${route}`, { user: credentials }).pipe(
      map((res) => {
        this.jwtService.save(res.user.token);
        this.currentUserSubject.next(res.user);
        return res;
      })
    );
  }

  update(fields: any): Observable<User> {
    return this.http.put<any>(`${environment.api}/user`, { user: fields }).pipe(
      map((res) => {
        this.currentUserSubject.next(res.user);
        return res.user;
      })
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.jwtService.destroy();
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  verifyAuth(): Observable<boolean> {
    const token = this.jwtService.get();

    if (!token) {
      this.currentUserSubject.next(null);
      return of(false);
    }

    if (this.current) {
      return of(true);
    }

    return this.http.get<any>(`${environment.api}/user`, {
      headers: new HttpHeaders({
        'Authorization': `Token ${token}`
      })
    }).pipe(
      map((res) => {
        this.currentUserSubject.next(res.user);
        return true;
      }),
      catchError(() => {
        this.jwtService.destroy();
        this.currentUserSubject.next(null);
        return of(false);
      })
    );
  }

  ensureAuthIs(requiredAuth: boolean): Observable<boolean> {
    return this.verifyAuth().pipe(
      map((authValid) => {
        if (authValid !== requiredAuth) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      })
    );
  }
}
