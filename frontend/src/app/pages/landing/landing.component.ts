import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [MatCardModule, MatButtonModule, MatIconModule, CommonModule],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.sass'
})
export class LandingComponent {
    Breakpoints = Breakpoints;
    breakpoint: string = Breakpoints.Large;

    constructor(private responsive: BreakpointObserver) { }

    ngOnInit() {

        this.responsive.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large])
            .subscribe(result => {

                const breakpoints = result.breakpoints;
                console.log("result", result);
                console.log("breakpoints", breakpoints);

                if (breakpoints[Breakpoints.XSmall]) {
                    this.breakpoint = Breakpoints.XSmall;
                    console.log("screens matches XSmall");
                }
                else if (breakpoints[Breakpoints.Small]) {
                    this.breakpoint = Breakpoints.Small;
                    console.log("screens matches Small");
                }
                else if (breakpoints[Breakpoints.Medium]) {
                    this.breakpoint = Breakpoints.Medium;
                    console.log("screens matches Medium");
                }
                else if (breakpoints[Breakpoints.Large]) {
                    console.log("screens matches Large");
                    this.breakpoint = Breakpoints.Large;
                }
            });
    }
}