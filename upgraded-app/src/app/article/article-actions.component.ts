import { Component, inject, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { ArticlesService } from '../services/articles.service';
import { UserService } from '../services/user.service';
import { ArticleMetaComponent } from '../shared/article-helpers/article-meta.component';
import { FollowBtnComponent } from '../shared/buttons/follow-btn.component';
import { FavoriteBtnComponent } from '../shared/buttons/favorite-btn.component';
import { Article } from '../models/article.model';

@Component({
  selector: 'app-article-actions',
  standalone: true,
  imports: [RouterLink, NgClass, ArticleMetaComponent, FollowBtnComponent, FavoriteBtnComponent],
  template: `
    <app-article-meta [article]="article">

      @if (canModify) {
        <span>
          <a class="btn btn-sm btn-outline-secondary"
            [routerLink]="['/editor', article.slug]">
            <i class="ion-edit"></i> Edit Article
          </a>

          <button class="btn btn-sm btn-outline-danger"
            [ngClass]="{ disabled: isDeleting }"
            (click)="deleteArticle()">
            <i class="ion-trash-a"></i> Delete Article
          </button>
        </span>
      }

      @if (!canModify) {
        <span>
          <app-follow-btn [user]="article.author"></app-follow-btn>
          <app-favorite-btn [article]="article">
            {{ article.favorited ? 'Unfavorite' : 'Favorite' }} Article <span class="counter">({{ article.favoritesCount }})</span>
          </app-favorite-btn>
        </span>
      }

    </app-article-meta>
  `
})
export class ArticleActionsComponent implements OnInit {
  private readonly articlesService = inject(ArticlesService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  @Input() article!: Article;
  canModify = false;
  isDeleting = false;

  ngOnInit(): void {
    if (this.userService.current && this.article) {
      this.canModify = (this.userService.current.username === this.article.author.username);
    } else {
      this.canModify = false;
    }
  }

  deleteArticle(): void {
    this.isDeleting = true;
    this.articlesService.destroy(this.article.slug).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.router.navigate(['/'])
    });
  }
}
