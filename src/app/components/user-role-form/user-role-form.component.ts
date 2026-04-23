import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User, UserRole } from '../../models/user.model';

@Component({
  selector: 'app-user-role-form',
  imports: [FormsModule, RouterLink, TitleCasePipe],
  templateUrl: './user-role-form.component.html',
  styleUrl: './user-role-form.component.scss'
})
export class UserRoleFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);

  user = signal<User | undefined>(undefined);
  selectedRole = signal<UserRole>('viewer');
  saved = signal(false);

  readonly availableRoles: UserRole[] = ['admin', 'editor', 'viewer'];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const found = this.userService.getUserById(id);
    if (found) {
      this.user.set(found);
      this.selectedRole.set(found.role);
    } else {
      this.router.navigate(['/users']);
    }
  }

  onSubmit(): void {
    const u = this.user();
    if (u) {
      this.userService.updateUserRole(u.id, this.selectedRole());
      this.saved.set(true);
      let destroyed = false;
      this.destroyRef.onDestroy(() => { destroyed = true; });
      setTimeout(() => {
        if (!destroyed) {
          this.router.navigate(['/users']);
        }
      }, 1000);
    }
  }
}
