import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  imports: [NgFor, RouterLink],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  private userService = inject(UserService);
  readonly users = this.userService.users;

  readonly roleBadgeClass: Record<UserRole, string> = {
    admin: 'badge-admin',
    editor: 'badge-editor',
    viewer: 'badge-viewer'
  };
}
