import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ScenarioStepComponent } from '../../components/landing/scenario-step/scenario-step.component';
import { RouterLink, Router } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { OnInit } from '@angular/core';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [MatCardModule, MatButtonModule, CommonModule, ScenarioStepComponent, RouterLink],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.sass'
})
export class LandingComponent implements OnInit {
    Breakpoints = Breakpoints;
    breakpoint: string = Breakpoints.Large;

    constructor(private responsive: BreakpointObserver, private router: Router, private seoService: SeoService) { }

    ngOnInit() {
        this.seoService.updateTitle("futbal-spoluhráč.sk | Ako to funguje?");
        this.seoService.updateMetaTags([
            { name: 'description', content: 'Zoznám sa s tým, ako funguje online služba na prepájanie hráčov a futbalových tímov.' }
        ]);

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