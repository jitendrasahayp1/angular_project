import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UserListComponent } from './user-list.component';
import { UserService } from '../../services/user.service';

describe('UserListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(UserListComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should display user list heading', async () => {
    const fixture = TestBed.createComponent(UserListComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('User Roles Management');
  });

  it('should render a card for each user', async () => {
    const service = TestBed.inject(UserService);
    const fixture = TestBed.createComponent(UserListComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.user-card');
    expect(cards.length).toBe(service.users().length);
  });
});
