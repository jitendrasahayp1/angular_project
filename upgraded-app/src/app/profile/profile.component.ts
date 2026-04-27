import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { UserService } from '../services/user.service';
import { FollowBtnComponent } from '../shared/buttons/follow-btn.component';
import { Profile } from '../models/profile.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, FollowBtnComponent],
  template: `
    @if (profile) {
      <div class="profile-page">

        <!-- User's basic info & action buttons -->
        <div class="user-info">
          <div class="container">
            <div class="row">
              <div class="col-xs-12 col-md-10 offset-md-1">

                <img [src]="profile.image" class="user-img" />
                <h4>{{ profile.username }}</h4>
                <p>{{ profile.bio }}</p>

                @if (isUser) {
                  <a routerLink="/settings"
                    class="btn btn-sm btn-outline-secondary action-btn">
                    <i class="ion-gear-a"></i> Edit Profile Settings
                  </a>
                }

                @if (!isUser) {
                  <app-follow-btn [user]="profile"></app-follow-btn>
                }

              </div>
            </div>
          </div>
        </div>

        <!-- Container where User's posts & favs are list w/ toggle tabs -->
        <div class="container">
          <div class="row">

            <div class="col-xs-12 col-md-10 offset-md-1">

              <!-- Tabs for switching between author articles & favorites -->
              <div class="articles-toggle">
                <ul class="nav nav-pills outline-active">

                  <li class="nav-item">
                    <a class="nav-link"
                      routerLinkActive="active"
                      [routerLinkActiveOptions]="{ exact: true }"
                      [routerLink]="['/@' + profile.username]">
                      My Articles
                    </a>
                  </li>

                  <li class="nav-item">
                    <a class="nav-link"
                      routerLinkActive="active"
                      [routerLink]="['/@' + profile.username, 'favorites']">
                      Favorited Articles
                    </a>
                  </li>

                </ul>
              </div>

              <!-- List of articles -->
              <router-outlet></router-outlet>

            </div>

          <!-- End row & container divs -->
          </div>
        </div>

      </div>
    }
  `
})
export class ProfileComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly profileService = inject(ProfileService);
  private readonly userService = inject(UserService);

  profile: Profile | null = null;
  isUser = false;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const username = params['username'];
      this.profileService.get(username).subscribe({
        next: (profile) => {
          this.profile = profile;
          if (this.userService.current) {
            this.isUser = (this.userService.current.username === this.profile.username);
          } else {
            this.isUser = false;
          }
        },
        error: () => {
          this.router.navigate(['/']);
        }
      });
    });
  }
}
