import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleMetaComponent } from './article-meta.component';
import { FavoriteBtnComponent } from '../buttons/favorite-btn.component';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-article-preview',
  standalone: true,
  imports: [RouterLink, ArticleMetaComponent, FavoriteBtnComponent],
  template: `
    <div class="article-preview">
      <app-article-meta [article]="article()">
        <app-favorite-btn
          [article]="article()"
          class="pull-xs-right">
          {{ article().favoritesCount }}
        </app-favorite-btn>
      </app-article-meta>

      <a [routerLink]="['/article', article().slug]" class="preview-link">
        <h1>{{ article().title }}</h1>
        <p>{{ article().description }}</p>
        <span>Read more...</span>
        <ul class="tag-list">
          @for (tag of article().tagList; track tag) {
            <li class="tag-default tag-pill tag-outline">
              {{ tag }}
            </li>
          }
        </ul>
      </a>
    </div>
  `
})
export class ArticlePreviewComponent {
  article = input.required<Article>();
}
