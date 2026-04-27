import { Component, inject, Input, output, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UserService } from '../services/user.service';
import { Comment } from '../models/comment.model';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="card">
      <div class="card-block">
        <p class="card-text">{{ data.body }}</p>
      </div>
      <div class="card-footer">
        <a class="comment-author" [routerLink]="['/@' + data.author.username]">
          <img [src]="data.author.image" class="comment-author-img" />
        </a>
        &nbsp;
        <a class="comment-author" [routerLink]="['/@' + data.author.username]">
          {{ data.author.username }}
        </a>
        <span class="date-posted">
          {{ data.createdAt | date: 'longDate' }}
        </span>
        @if (canModify) {
          <span class="mod-options">
            <i class="ion-trash-a" (click)="delete.emit()"></i>
          </span>
        }
      </div>
    </div>
  `
})
export class CommentComponent implements OnInit {
  private readonly userService = inject(UserService);

  @Input() data!: Comment;
  delete = output();

  canModify = false;

  ngOnInit(): void {
    if (this.userService.current) {
      this.canModify = (this.userService.current.username === this.data.author.username);
    } else {
      this.canModify = false;
    }
  }
}
