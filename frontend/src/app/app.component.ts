import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { MatSidenavContainer, MatSidenavContent, MatSidenav } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatNavList, MatListItem } from '@angular/material/list';
import { menuRoutes } from './app.routes';
import { AppToolbarComponent } from './components/app-toolbar/app-toolbar.component';
import { FooterComponent } from './components/footer/footer.component';

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
        MatIcon,
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

    toggleSideNav() {
        this.sidenav.toggle();
    }
}