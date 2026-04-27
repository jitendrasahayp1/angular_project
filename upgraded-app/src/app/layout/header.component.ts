import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LowerCasePipe } from '@angular/common';
import { UserService, User } from '../services/user.service';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LowerCasePipe],
  template: `
    <nav class="navbar navbar-light">
      <div class="container">

        <a class="navbar-brand"
          routerLink="/">
          {{ appName | lowercase }}
        </a>

        @if (!currentUser) {
          <!-- Show this for logged out users -->
          <ul class="nav navbar-nav pull-xs-right">

            <li class="nav-item">
              <a class="nav-link"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                routerLink="/">
                Home
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link"
                routerLinkActive="active"
                routerLink="/login">
                Sign in
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link"
                routerLinkActive="active"
                routerLink="/register">
                Sign up
              </a>
            </li>

          </ul>
        }

        @if (currentUser) {
          <!-- Show this for logged in users -->
          <ul class="nav navbar-nav pull-xs-right">

            <li class="nav-item">
              <a class="nav-link"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                routerLink="/">
                Home
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link"
                routerLinkActive="active"
                routerLink="/editor">
                <i class="ion-compose"></i>&nbsp;New Article
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link"
                routerLinkActive="active"
                routerLink="/settings">
                <i class="ion-gear-a"></i>&nbsp;Settings
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link"
                routerLinkActive="active"
                [routerLink]="['/@' + currentUser.username]">
                <img [src]="currentUser.image" class="user-pic" />
                {{ currentUser.username }}
              </a>
            </li>

          </ul>
        }

      </div>
    </nav>
  `
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly userService = inject(UserService);
  private subscription!: Subscription;

  appName = environment.appName;
  currentUser: User | null = null;

  ngOnInit(): void {
    this.subscription = this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
