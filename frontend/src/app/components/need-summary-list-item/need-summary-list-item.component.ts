import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-need-summary-list-item',
  standalone: true,
  imports: [],
  templateUrl: './need-summary-list-item.component.html',
  styleUrl: './need-summary-list-item.component.sass'
})
export class NeedSummaryListItemComponent {
    @Input() title?: string;

    @Input() value?: string | null | undefined
}
