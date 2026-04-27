import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { UserService } from '../services/user.service';
import { ListErrorsComponent } from '../shared/list-errors.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, ListErrorsComponent],
  template: `
    <div class="settings-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">

            <h1 class="text-xs-center">Your Settings</h1>

            <app-list-errors [errors]="errors"></app-list-errors>

            <form (ngSubmit)="submitForm()">
              <fieldset [disabled]="isSubmitting">

                <fieldset class="form-group">
                  <input class="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                    [(ngModel)]="formData.image"
                    name="image" />
                </fieldset>

                <fieldset class="form-group">
                  <input class="form-control form-control-lg"
                    type="text"
                    placeholder="Username"
                    [(ngModel)]="formData.username"
                    name="username" />
                </fieldset>

                <fieldset class="form-group">
                  <textarea class="form-control form-control-lg"
                    rows="8"
                    placeholder="Short bio about you"
                    [(ngModel)]="formData.bio"
                    name="bio">
                  </textarea>
                </fieldset>

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
                    placeholder="New Password"
                    [(ngModel)]="formData.password"
                    name="password" />
                </fieldset>

                <button class="btn btn-lg btn-primary pull-xs-right"
                  type="submit">
                  Update Settings
                </button>

              </fieldset>
            </form>

            <!-- Line break for logout button -->
            <hr />

            <button class="btn btn-outline-danger"
              (click)="logout()">
              Or click here to logout.
            </button>

          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);

  formData: any = {};
  errors: { [key: string]: string[] } | null = null;
  isSubmitting = false;

  ngOnInit(): void {
    this.titleService.setTitle(`Settings — ${environment.appName}`);

    const user = this.userService.current;
    if (user) {
      this.formData = {
        email: user.email,
        bio: user.bio,
        image: user.image,
        username: user.username
      };
    }
  }

  submitForm(): void {
    this.isSubmitting = true;
    this.userService.update(this.formData).subscribe({
      next: (user) => {
        this.router.navigate(['/@' + user.username]);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errors = err.error?.errors || null;
      }
    });
  }

  logout(): void {
    this.userService.logout();
  }
}
