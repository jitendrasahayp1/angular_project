import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { UserRole } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return initial users list', () => {
    const users = service.users();
    expect(users.length).toBeGreaterThan(0);
  });

  it('should find a user by id', () => {
    const user = service.getUserById(1);
    expect(user).toBeDefined();
    expect(user?.id).toBe(1);
  });

  it('should return undefined for non-existent user', () => {
    const user = service.getUserById(999);
    expect(user).toBeUndefined();
  });

  it('should update user role', () => {
    const userId = 1;
    const newRole: UserRole = 'viewer';
    service.updateUserRole(userId, newRole);
    const updated = service.getUserById(userId);
    expect(updated?.role).toBe(newRole);
  });

  it('should not affect other users when updating role', () => {
    const originalUser2 = service.getUserById(2);
    const originalRole = originalUser2?.role;
    service.updateUserRole(1, 'viewer');
    const user2 = service.getUserById(2);
    expect(user2?.role).toBe(originalRole);
  });
});
