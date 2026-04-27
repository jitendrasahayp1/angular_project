import { Component, inject, input, effect } from '@angular/core';
import { ArticlesService } from '../../services/articles.service';
import { ArticlePreviewComponent } from './article-preview.component';
import { ListPaginationComponent } from './list-pagination.component';
import { Article, ArticleListConfig } from '../../models/article.model';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [ArticlePreviewComponent, ListPaginationComponent],
  template: `
    @for (article of list; track article.slug) {
      <app-article-preview [article]="article"></app-article-preview>
    }

    @if (loading) {
      <div class="article-preview">
        Loading articles...
      </div>
    }

    @if (!loading && list.length === 0) {
      <div class="article-preview">
        No articles are here... yet.
      </div>
    }

    @if (currentConfig && currentConfig.totalPages && currentConfig.totalPages > 1) {
      <app-list-pagination
        [totalPages]="currentConfig.totalPages"
        [currentPage]="currentConfig.currentPage || 1"
        (pageChange)="setPageTo($event)">
      </app-list-pagination>
    }
  `
})
export class ArticleListComponent {
  private readonly articlesService = inject(ArticlesService);

  limit = input<number>(10);
  listConfig = input.required<ArticleListConfig>();

  list: Article[] = [];
  loading = false;
  currentConfig: ArticleListConfig = { type: 'all' };

  constructor() {
    effect(() => {
      const config = this.listConfig();
      this.setListTo(config);
    });
  }

  setListTo(newList: ArticleListConfig): void {
    this.list = [];
    this.currentConfig = { ...newList };
    this.runQuery();
  }

  setPageTo(pageNumber: number): void {
    this.currentConfig.currentPage = pageNumber;
    this.runQuery();
  }

  runQuery(): void {
    this.loading = true;
    this.currentConfig = this.currentConfig || {};

    const queryConfig: ArticleListConfig = {
      type: this.currentConfig.type || 'all',
      filters: { ...(this.currentConfig.filters || {}) }
    };

    queryConfig.filters!['limit'] = this.limit();

    if (!this.currentConfig.currentPage) {
      this.currentConfig.currentPage = 1;
    }

    queryConfig.filters!['offset'] = this.limit() * (this.currentConfig.currentPage - 1);

    this.articlesService.query(queryConfig).subscribe({
      next: (res) => {
        this.loading = false;
        this.list = res.articles;
        this.currentConfig.totalPages = Math.ceil(res.articlesCount / this.limit());
      }
    });
  }
}
