import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ScenarioStepComponent } from '../../components/landing/scenario-step/scenario-step.component';
import { RouterLink, Router } from '@angular/router';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [MatCardModule, MatButtonModule, MatIconModule, CommonModule, ScenarioStepComponent, RouterLink],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.sass'
})
export class LandingComponent {
    Breakpoints = Breakpoints;
    breakpoint: string = Breakpoints.Large;

    constructor(private responsive: BreakpointObserver, private router: Router) { }

    ngOnInit() {
        this.responsive.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large])
            .subscribe(result => {
                const breakpoints = result.breakpoints;

                if (breakpoints[Breakpoints.XSmall]) {
                    this.breakpoint = Breakpoints.XSmall;
                }
                else if (breakpoints[Breakpoints.Small]) {
                    this.breakpoint = Breakpoints.Small;
                }
                else if (breakpoints[Breakpoints.Medium]) {
                    this.breakpoint = Breakpoints.Medium;
                }
                else if (breakpoints[Breakpoints.Large]) {
                    this.breakpoint = Breakpoints.Large;
                }
            });
    }

    navigate(route: string) {
        this.router.navigate([route]);
    }
}