import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';
import { Profile } from '../../models/profile.model';

@Component({
  selector: 'app-follow-btn',
  standalone: true,
  imports: [NgClass],
  template: `
    <button
      class="btn btn-sm action-btn"
      [ngClass]="{
        'disabled': isSubmitting,
        'btn-outline-secondary': !user().following,
        'btn-secondary': user().following
      }"
      (click)="submit()">
      <i class="ion-plus-round"></i>
      &nbsp;
      {{ user().following ? 'Unfollow' : 'Follow' }} {{ user().username }}
    </button>
  `
})
export class FollowBtnComponent {
  private readonly profileService = inject(ProfileService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  user = input.required<Profile>();

  isSubmitting = false;

  submit(): void {
    this.isSubmitting = true;

    if (!this.userService.current) {
      this.router.navigate(['/register']);
      return;
    }

    const currentUser = this.user();

    if (currentUser.following) {
      this.profileService.unfollow(currentUser.username).subscribe({
        next: () => {
          this.isSubmitting = false;
          currentUser.following = false;
        }
      });
    } else {
      this.profileService.follow(currentUser.username).subscribe({
        next: () => {
          this.isSubmitting = false;
          currentUser.following = true;
        }
      });
    }
  }
}
