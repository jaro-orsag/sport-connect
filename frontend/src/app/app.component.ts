import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { MatSidenavContainer, MatSidenavContent, MatSidenav } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatNavList, MatListItem } from '@angular/material/list';
import { menuRoutes } from './app.routes';
import { AppToolbarComponent } from './components/app-toolbar/app-toolbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { filter } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        MatSidenavContainer,
        MatSidenavContent,
        MatSidenav,
        MatToolbar,
        MatNavList,
        MatListItem,
        AppToolbarComponent,
        FooterComponent
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent {
    @ViewChild(MatSidenav)
    sidenav!: MatSidenav;
    title = 'routing-app';
    routes = menuRoutes;

    constructor(private router: Router, private viewportScroller: ViewportScroller) { }

    ngOnInit() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            setTimeout(() => {
                this.viewportScroller.scrollToPosition([0, 0]);
            }, 0);
        });
    }

    toggleSideNav() {
        this.sidenav.toggle();
    }
}