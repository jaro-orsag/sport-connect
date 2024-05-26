import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DetailPageState } from '../../../services/detail-page-state';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-marketing-consent',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './marketing-consent.component.html',
  styleUrl: './marketing-consent.component.sass'
})
export class MarketingConsentComponent {
    DetailPageState = DetailPageState;

    @Input() pageState!: DetailPageState;

    @Input() isGranted!: boolean;

    @Input() grant!: () => void;

    @Input() revoke!: () => void;
}
