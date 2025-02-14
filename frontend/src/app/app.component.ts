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
import { AnalyticsService } from './services/analytics.service';
import { ConsentPopupComponent } from './components/consent-popup/consent-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { GdprConsentService } from './services/gdpr-consent.service';

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

    constructor(
        private router: Router,
        private viewportScroller: ViewportScroller,
        // Ensuring the service is instantiated, so that tracking ID initialization script is added by calling 
        // service constructor
        private analyticsService: AnalyticsService,
        private dialog: MatDialog,
        private gdprConsentService: GdprConsentService
    ) { }

    ngOnInit() {
        this.analyticsService.injectGoogleServices();
        this.handleGdprConsent();
        this.scrollAndTrackOnNavigate();
    }

    handleGdprConsent() {
        if (!this.gdprConsentService.isGranted()) {
            this.dialog.open(ConsentPopupComponent, {
                disableClose: true
            }).afterClosed().subscribe(_ => {
                if (this.gdprConsentService.isGranted()) {
                    // track page view of current page - it was not tracked by router subscribe mechanism 
                    // because consent was not granted when the page was navigated
                    this.analyticsService.injectGoogleServices();
                    this.analyticsService.trackPageView(this.router.url);
                }
            });
        }
    }

    scrollAndTrackOnNavigate() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event) => {
            if (!(event instanceof NavigationEnd)) {
                return
            }
            this.scrollToTop()
            this.analyticsService.trackPageView(event.urlAfterRedirects);
        });
    }

    toggleSideNav() {
        this.sidenav.toggle();
    }

    scrollToTop() {
        setTimeout(() => {
            this.viewportScroller.scrollToPosition([0, 0]);
        }, 0);
    }
}