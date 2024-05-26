import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-congratulations',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './congratulations.component.html',
  styleUrl: './congratulations.component.sass'
})
export class CongratulationsComponent {
    @Input() navigatedFromAddition!: boolean;
    @Input() text!: string;
}
