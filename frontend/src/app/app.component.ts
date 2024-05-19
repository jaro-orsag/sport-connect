import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { MatSidenavContainer, MatSidenavContent, MatSidenav } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatNavList } from '@angular/material/list';
import { menuRoutes } from './app.routes';

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
        MatNavList
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