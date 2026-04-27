import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ArticlesService } from '../services/articles.service';
import { UserService } from '../services/user.service';
import { ListErrorsComponent } from '../shared/list-errors.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [FormsModule, ListErrorsComponent],
  template: `
    <div class="editor-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-10 offset-md-1 col-xs-12">

            <app-list-errors [errors]="errors"></app-list-errors>

            <form>
              <fieldset [disabled]="isSubmitting">

                <fieldset class="form-group">
                  <input class="form-control form-control-lg"
                    [(ngModel)]="article.title"
                    name="title"
                    type="text"
                    placeholder="Article Title" />
                </fieldset>

                <fieldset class="form-group">
                  <input class="form-control"
                    [(ngModel)]="article.description"
                    name="description"
                    type="text"
                    placeholder="What's this article about?" />
                </fieldset>

                <fieldset class="form-group">
                  <textarea class="form-control"
                    rows="8"
                    [(ngModel)]="article.body"
                    name="body"
                    placeholder="Write your article (in markdown)">
                  </textarea>
                </fieldset>

                <fieldset class="form-group">
                  <input class="form-control"
                    type="text"
                    placeholder="Enter tags"
                    [(ngModel)]="tagField"
                    name="tagField"
                    (keyup.enter)="addTag()" />

                  <div class="tag-list">
                    @for (tag of article.tagList; track tag) {
                      <span class="tag-default tag-pill">
                        <i class="ion-close-round" (click)="removeTag(tag)"></i>
                        {{ tag }}
                      </span>
                    }
                  </div>
                </fieldset>

                <button class="btn btn-lg pull-xs-right btn-primary" type="button" (click)="submit()">
                  Publish Article
                </button>

              </fieldset>
            </form>

          </div>
        </div>
      </div>
    </div>
  `
})
export class EditorComponent implements OnInit {
  private readonly articlesService = inject(ArticlesService);
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);

  article: any = {
    title: '',
    description: '',
    body: '',
    tagList: []
  };
  tagField = '';
  errors: { [key: string]: string[] } | null = null;
  isSubmitting = false;

  ngOnInit(): void {
    this.titleService.setTitle(`Editor — ${environment.appName}`);

    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.articlesService.get(slug).subscribe({
          next: (article) => {
            // Only allow editing if the current user is the author
            if (this.userService.current &&
                this.userService.current.username === article.author.username) {
              this.article = article;
            } else {
              this.router.navigate(['/']);
            }
          },
          error: () => {
            this.router.navigate(['/']);
          }
        });
      }
    });
  }

  addTag(): void {
    if (this.tagField && !this.article.tagList.includes(this.tagField)) {
      this.article.tagList.push(this.tagField);
      this.tagField = '';
    }
  }

  removeTag(tagName: string): void {
    this.article.tagList = this.article.tagList.filter((slug: string) => slug !== tagName);
  }

  submit(): void {
    this.isSubmitting = true;

    this.articlesService.save(this.article).subscribe({
      next: (newArticle) => {
        this.router.navigate(['/article', newArticle.slug]);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errors = err.error?.errors || null;
      }
    });
  }
}
