import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { ArticlesService } from '../../services/articles.service';
import { UserService } from '../../services/user.service';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-favorite-btn',
  standalone: true,
  imports: [NgClass],
  template: `
    <button class="btn btn-sm"
      [ngClass]="{
        'disabled': isSubmitting,
        'btn-outline-primary': !article().favorited,
        'btn-primary': article().favorited
      }"
      (click)="submit()">
      <i class="ion-heart"></i> <ng-content></ng-content>
    </button>
  `
})
export class FavoriteBtnComponent {
  private readonly articlesService = inject(ArticlesService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  article = input.required<Article>();
  favorited = output<Article>();

  isSubmitting = false;

  submit(): void {
    this.isSubmitting = true;

    if (!this.userService.current) {
      this.router.navigate(['/register']);
      return;
    }

    const currentArticle = this.article();

    if (currentArticle.favorited) {
      this.articlesService.unfavorite(currentArticle.slug).subscribe({
        next: () => {
          this.isSubmitting = false;
          currentArticle.favorited = false;
          currentArticle.favoritesCount--;
          this.favorited.emit(currentArticle);
        }
      });
    } else {
      this.articlesService.favorite(currentArticle.slug).subscribe({
        next: () => {
          this.isSubmitting = false;
          currentArticle.favorited = true;
          currentArticle.favoritesCount++;
          this.favorited.emit(currentArticle);
        }
      });
    }
  }
}
