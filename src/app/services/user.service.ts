import { Injectable, signal } from '@angular/core';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _users = signal<User[]>([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'editor' },
    { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'viewer' },
    { id: 4, name: 'David Brown', email: 'david@example.com', role: 'editor' },
    { id: 5, name: 'Eva Green', email: 'eva@example.com', role: 'viewer' },
  ]);

  readonly users = this._users.asReadonly();

  updateUserRole(userId: number, role: UserRole): void {
    this._users.update(users =>
      users.map(user => user.id === userId ? { ...user, role } : user)
    );
  }

  getUserById(userId: number): User | undefined {
    return this._users().find(user => user.id === userId);
  }
}
