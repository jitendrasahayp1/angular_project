import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private readonly jwtKey = environment.jwtKey;

  save(token: string): void {
    localStorage.setItem(this.jwtKey, token);
  }

  get(): string | null {
    return localStorage.getItem(this.jwtKey);
  }

  destroy(): void {
    localStorage.removeItem(this.jwtKey);
  }
}
