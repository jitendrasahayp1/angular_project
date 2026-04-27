import { Directive, Input, TemplateRef, ViewContainerRef, inject, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appShowAuthed]',
  standalone: true
})
export class ShowAuthedDirective implements OnInit, OnDestroy {
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly userService = inject(UserService);

  private subscription!: Subscription;
  private showForAuthed = true;
  private hasView = false;

  @Input() set appShowAuthed(condition: boolean) {
    this.showForAuthed = condition;
  }

  ngOnInit(): void {
    this.subscription = this.userService.currentUser$.subscribe(user => {
      const isAuthenticated = !!user;
      const shouldShow =
        (isAuthenticated && this.showForAuthed) ||
        (!isAuthenticated && !this.showForAuthed);

      if (shouldShow && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!shouldShow && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
