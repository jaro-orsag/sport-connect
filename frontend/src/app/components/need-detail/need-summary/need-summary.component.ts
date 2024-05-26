import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { DetailPageState } from '../../../services/detail-page-state';
import { NeedSummaryListItemComponent } from '../../need-summary-list-item/need-summary-list-item.component';

@Component({
  selector: 'app-need-summary',
  standalone: true,
  imports: [MatCardModule, CommonModule, NeedSummaryListItemComponent],
  templateUrl: './need-summary.component.html',
  styleUrl: './need-summary.component.sass'
})
export class NeedSummaryComponent {
    DetailPageState = DetailPageState;

    @Input() pageState!: DetailPageState;
    @Input() title!: string;
    @Input() getItems!: () => Array<[string, string]>;

    getSummaryTitle(): string {
        if (this.pageState == DetailPageState.EXISTS_ACTIVE) {
            return this.title;
        }

        if (this.pageState == DetailPageState.EXISTS_NOT_ACTIVE) {
            return `${this.title} bolo zrušené`;
        }

        if (this.pageState == DetailPageState.DOES_NOT_EXIST) {
            return "Chyba";
        }

        return "Načítavam...";
    }
}
