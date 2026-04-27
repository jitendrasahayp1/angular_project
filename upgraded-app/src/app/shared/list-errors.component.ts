import { Component, input } from '@angular/core';

@Component({
  selector: 'app-list-errors',
  standalone: true,
  template: `
    @if (errors()) {
      <ul class="error-messages">
        @for (field of errorList(); track field.field) {
          @for (error of field.errors; track error) {
            <li>{{ field.field }} {{ error }}</li>
          }
        }
      </ul>
    }
  `
})
export class ListErrorsComponent {
  errors = input<{ [key: string]: string[] } | null>(null);

  errorList(): { field: string; errors: string[] }[] {
    const errs = this.errors();
    if (!errs) return [];
    return Object.keys(errs).map(field => ({
      field,
      errors: errs[field]
    }));
  }
}
