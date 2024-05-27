import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-scenario-step',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './scenario-step.component.html',
  styleUrl: './scenario-step.component.sass'
})
export class ScenarioStepComponent {
    Breakpoints = Breakpoints;
    
    @Input() breakpoint!: string;

    @Input() icon!: string;

    @Input() title!: string;

    @Input() description!: string;
}
