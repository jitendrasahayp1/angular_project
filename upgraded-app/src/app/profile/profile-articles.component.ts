import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ArticleListComponent } from '../shared/article-helpers/article-list.component';
import { ArticleListConfig } from '../models/article.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile-articles',
  standalone: true,
  imports: [ArticleListComponent],
  template: `
    <app-article-list [limit]="5" [listConfig]="listConfig"></app-article-list>
  `
})
export class ProfileArticlesComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly titleService = inject(Title);

  listConfig: ArticleListConfig = { type: 'all' };

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
      const username = params['username'];
      // Determine if we're on main or favorites
      const url = this.route.snapshot.url;
      const isFavorites = url.length > 0 && url[url.length - 1].path === 'favorites';

      this.listConfig = { type: 'all' };

      if (isFavorites) {
        this.listConfig.filters = { favorited: username };
        this.titleService.setTitle(`Articles favorited by ${username} — ${environment.appName}`);
      } else {
        this.listConfig.filters = { author: username };
        this.titleService.setTitle(`@${username} — ${environment.appName}`);
      }
    });
  }
}
