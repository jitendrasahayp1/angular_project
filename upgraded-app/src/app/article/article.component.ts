import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { marked } from 'marked';
import { ArticlesService } from '../services/articles.service';
import { CommentsService } from '../services/comments.service';
import { UserService, User } from '../services/user.service';
import { ArticleActionsComponent } from './article-actions.component';
import { CommentComponent } from './comment.component';
import { ShowAuthedDirective } from '../shared/show-authed.directive';
import { ListErrorsComponent } from '../shared/list-errors.component';
import { Article } from '../models/article.model';
import { Comment } from '../models/comment.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    RouterLink, FormsModule,
    ArticleActionsComponent, CommentComponent,
    ShowAuthedDirective, ListErrorsComponent
  ],
  template: `
    @if (article) {
      <div class="article-page">

        <!-- Banner for article title, action buttons -->
        <div class="banner">
          <div class="container">

            <h1>{{ article.title }}</h1>

            <div class="article-meta">
              <!-- Show author info + favorite & follow buttons -->
              <app-article-actions [article]="article"></app-article-actions>
            </div>

          </div>
        </div>

        <!-- Main view. Contains article html and comments -->
        <div class="container page">

          <!-- Article's HTML & tags rendered here -->
          <div class="row article-content">
            <div class="col-xs-12">

              <div [innerHTML]="articleBody"></div>

              <ul class="tag-list">
                @for (tag of article.tagList; track tag) {
                  <li class="tag-default tag-pill tag-outline">
                    {{ tag }}
                  </li>
                }
              </ul>

            </div>
          </div>

          <hr />

          <div class="article-actions">

            <!-- Show author info + favorite & follow buttons -->
            <app-article-actions [article]="article"></app-article-actions>

          </div>

          <!-- Comments section -->
          <div class="row">
            <div class="col-xs-12 col-md-8 offset-md-2">

              <div *appShowAuthed="true">
                <app-list-errors [errors]="commentForm.errors"></app-list-errors>
                <form class="card comment-form" (ngSubmit)="addComment()">
                  <fieldset [disabled]="commentForm.isSubmitting">
                    <div class="card-block">
                      <textarea class="form-control"
                        placeholder="Write a comment..."
                        rows="3"
                        [(ngModel)]="commentForm.body"
                        name="commentBody"></textarea>
                    </div>
                    <div class="card-footer">
                      <img [src]="currentUser?.image || ''" class="comment-author-img" />
                      <button class="btn btn-sm btn-primary" type="submit">
                       Post Comment
                      </button>
                    </div>
                  </fieldset>
                </form>
              </div>

              <div *appShowAuthed="false">
                <a routerLink="/login">Sign in</a> or <a routerLink="/register">sign up</a> to add comments on this article.
              </div>

              @for (cmt of comments; track cmt.id; let idx = $index) {
                <app-comment
                  [data]="cmt"
                  (delete)="deleteComment(cmt.id, idx)">
                </app-comment>
              }

            </div>
          </div>

        </div>

      </div>
    }
  `
})
export class ArticleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly articlesService = inject(ArticlesService);
  private readonly commentsService = inject(CommentsService);
  private readonly userService = inject(UserService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly titleService = inject(Title);

  article: Article | null = null;
  articleBody: SafeHtml = '';
  comments: Comment[] = [];
  currentUser: User | null = null;
  commentForm = {
    isSubmitting: false,
    body: '',
    errors: null as { [key: string]: string[] } | null
  };

  ngOnInit(): void {
    this.currentUser = this.userService.current;

    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.articlesService.get(slug).subscribe({
        next: (article) => {
          this.article = article;
          this.titleService.setTitle(`${article.title} — ${environment.appName}`);
          this.articleBody = this.sanitizer.bypassSecurityTrustHtml(
            marked(article.body, { async: false }) as string
          );

          this.commentsService.getAll(article.slug).subscribe({
            next: (comments) => this.comments = comments
          });
        },
        error: () => {
          this.router.navigate(['/']);
        }
      });
    });
  }

  resetCommentForm(): void {
    this.commentForm = {
      isSubmitting: false,
      body: '',
      errors: null
    };
  }

  addComment(): void {
    this.commentForm.isSubmitting = true;

    this.commentsService.add(this.article!.slug, this.commentForm.body).subscribe({
      next: (comment) => {
        this.comments.unshift(comment);
        this.resetCommentForm();
      },
      error: (err) => {
        this.commentForm.isSubmitting = false;
        this.commentForm.errors = err.error?.errors || null;
      }
    });
  }

  deleteComment(commentId: number, index: number): void {
    this.commentsService.destroy(commentId, this.article!.slug).subscribe({
      next: () => {
        this.comments.splice(index, 1);
      }
    });
  }
}
