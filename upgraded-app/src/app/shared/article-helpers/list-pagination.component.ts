import { Component, input, output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-list-pagination',
  standalone: true,
  imports: [NgClass],
  template: `
    <nav>
      <ul class="pagination">
        @for (pageNumber of pageRange(); track pageNumber) {
          <li class="page-item"
            [ngClass]="{ active: pageNumber === currentPage() }"
            (click)="changePage(pageNumber)">
            <a class="page-link" href="">{{ pageNumber }}</a>
          </li>
        }
      </ul>
    </nav>
  `
})
export class ListPaginationComponent {
  totalPages = input<number>(0);
  currentPage = input<number>(1);
  pageChange = output<number>();

  pageRange(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages(); i++) {
      pages.push(i + 1);
    }
    return pages;
  }

  changePage(pageNumber: number): void {
    this.pageChange.emit(pageNumber);
  }
}
