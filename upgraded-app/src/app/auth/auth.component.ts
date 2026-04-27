import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { UserService } from '../services/user.service';
import { ListErrorsComponent } from '../shared/list-errors.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterLink, FormsModule, ListErrorsComponent],
  template: `
    <div class="auth-page">
      <div class="container page">
        <div class="row">

          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">{{ title }}</h1>
            <p class="text-xs-center">
              @if (authType === 'register') {
                <a routerLink="/login">
                  Have an account?
                </a>
              }
              @if (authType === 'login') {
                <a routerLink="/register">
                  Need an account?
                </a>
              }
            </p>

            <app-list-errors [errors]="errors"></app-list-errors>

            <form (ngSubmit)="submitForm()">
              <fieldset [disabled]="isSubmitting">

                @if (authType === 'register') {
                  <fieldset class="form-group">
                    <input class="form-control form-control-lg"
                      type="text"
                      placeholder="Username"
                      [(ngModel)]="formData.username"
                      name="username" />
                  </fieldset>
                }

                <fieldset class="form-group">
                  <input class="form-control form-control-lg"
                    type="email"
                    placeholder="Email"
                    [(ngModel)]="formData.email"
                    name="email" />
                </fieldset>

                <fieldset class="form-group">
                  <input class="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    [(ngModel)]="formData.password"
                    name="password" />
                </fieldset>

                <button class="btn btn-lg btn-primary pull-xs-right"
                  type="submit">
                  {{ title }}
                </button>

              </fieldset>
            </form>
          </div>

        </div>
      </div>
    </div>
  `
})
export class AuthComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);

  authType = '';
  title = '';
  errors: { [key: string]: string[] } | null = null;
  isSubmitting = false;
  formData: any = {};

  ngOnInit(): void {
    this.route.url.subscribe(segments => {
      const path = segments.length > 0 ? segments[0].path : '';
      this.authType = (path === 'login') ? 'login' : 'register';
      this.title = (this.authType === 'login') ? 'Sign in' : 'Sign up';
      this.titleService.setTitle(`${this.title} — ${environment.appName}`);
    });
  }

  submitForm(): void {
    this.isSubmitting = true;

    this.userService.attemptAuth(this.authType, this.formData).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errors = err.error.errors;
      }
    });
  }
}
