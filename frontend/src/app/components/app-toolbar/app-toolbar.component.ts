import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
    selector: 'app-toolbar',
    standalone: true,
    imports: [MatToolbar, CommonModule],
    templateUrl: './app-toolbar.component.html',
    styleUrl: './app-toolbar.component.sass'
})
export class AppToolbarComponent {
    @Input()
    sideNav!: MatSidenav;

    @Input()
    insideSideNav!: boolean;

    constructor(
        private router: Router
    ) { }

    toggleSideNav() {
        this.sideNav.toggle();
    }

    navigateToLandingPage() {
        this.router.navigate(['']);
        if (this.insideSideNav) {
            this.toggleSideNav();
        }
    }
}
