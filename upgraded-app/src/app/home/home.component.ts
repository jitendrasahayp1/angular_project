import { Component, inject, OnInit, signal } from '@angular/core';
import { NgClass, LowerCasePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { UserService } from '../services/user.service';
import { TagsService } from '../services/tags.service';
import { ArticleListComponent } from '../shared/article-helpers/article-list.component';
import { ShowAuthedDirective } from '../shared/show-authed.directive';
import { ArticleListConfig } from '../models/article.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgClass, LowerCasePipe, ArticleListComponent, ShowAuthedDirective],
  template: `
    <div class="home-page">

      <!-- Splash banner that only shows when not logged in -->
      <div class="banner" *appShowAuthed="false">
        <div class="container">
          <h1 class="logo-font">{{ appName | lowercase }}</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div class="container page">
        <div class="row">

          <!-- Main view - contains tabs & article list -->
          <div class="col-md-9">
            <!-- Tabs for toggling between feed, article lists -->
            <div class="feed-toggle">
              <ul class="nav nav-pills outline-active">

                @if (isAuthenticated) {
                  <li class="nav-item">
                    <a href="" class="nav-link"
                      [ngClass]="{ active: listConfig.type === 'feed' }"
                      (click)="changeList({ type: 'feed' }); $event.preventDefault()">
                      Your Feed
                    </a>
                  </li>
                }

                <li class="nav-item">
                  <a href="" class="nav-link"
                    [ngClass]="{ active: listConfig.type === 'all' && !listConfig.filters?.['tag'] }"
                    (click)="changeList({ type: 'all' }); $event.preventDefault()">
                    Global Feed
                  </a>
                </li>

                @if (listConfig.filters?.['tag']) {
                  <li class="nav-item">
                    <a href="" class="nav-link active">
                      <i class="ion-pound"></i> {{ listConfig.filters?.['tag'] }}
                    </a>
                  </li>
                }

              </ul>
            </div>

            <!-- List the current articles -->
            <app-article-list [limit]="10" [listConfig]="listConfig"></app-article-list>

          </div>

          <!-- Sidebar where popular tags are listed -->
          <div class="col-md-3">
            <div class="sidebar">

              <p>Popular Tags</p>

              @if (tags.length > 0) {
                <div class="tag-list">
                  @for (tagName of tags; track tagName) {
                    <a href="" class="tag-default tag-pill"
                      (click)="changeList({ type: 'all', filters: { tag: tagName } }); $event.preventDefault()">
                      {{ tagName }}
                    </a>
                  }
                </div>
              }

              @if (!tagsLoaded) {
                <div>
                  Loading tags...
                </div>
              }

              @if (tagsLoaded && tags.length === 0) {
                <div class="post-preview">
                  No tags are here... yet.
                </div>
              }

            </div>
          </div>

          <!-- End the row & container divs -->
        </div>
      </div>

    </div>
  `
})
export class HomeComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly tagsService = inject(TagsService);
  private readonly titleService = inject(Title);

  appName = environment.appName;
  isAuthenticated = false;
  tags: string[] = [];
  tagsLoaded = false;
  listConfig: ArticleListConfig = { type: 'all' };

  ngOnInit(): void {
    this.titleService.setTitle(`Home — ${environment.appName}`);

    this.isAuthenticated = !!this.userService.current;

    this.listConfig = {
      type: this.userService.current ? 'feed' : 'all'
    };

    this.tagsService.getAll().subscribe({
      next: (tags) => {
        this.tagsLoaded = true;
        this.tags = tags;
      }
    });
  }

  changeList(newList: ArticleListConfig): void {
    this.listConfig = { ...newList };
  }
}
