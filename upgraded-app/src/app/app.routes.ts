import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { ArticleComponent } from './article/article.component';
import { EditorComponent } from './editor/editor.component';
import { SettingsComponent } from './settings/settings.component';
import { authGuard, noAuthGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: AuthComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: 'register',
    component: AuthComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: 'article/:slug',
    component: ArticleComponent
  },
  {
    path: 'editor',
    component: EditorComponent,
    canActivate: [authGuard]
  },
  {
    path: 'editor/:slug',
    component: EditorComponent,
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [authGuard]
  }
];
