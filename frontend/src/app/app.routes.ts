import { Routes } from '@angular/router';
import { TeamNeedComponent } from './pages/team-need/team-need.component';
import { PlayerNeedComponent } from './pages/player-need/player-need.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { LandingComponent } from './pages/landing/landing.component';

export const menuRoutes: Routes = [
    { path: 'player-need', component: PlayerNeedComponent, data: [{'title': 'Hľadám tím'}] },
    { path: 'team-need', component: TeamNeedComponent, data: [{'title': 'Hľadáme hráča'}] },
    { path: 'terms-conditions', component: TermsAndConditionsComponent, data: [{'title': 'Súhlasy'}] },
    { path: 'about-us', component: AboutUsComponent, data: [{'title': 'O nás'}] }
];

export const routes: Routes = [
    ...menuRoutes,
    { path: '', component: LandingComponent },
    { path: '**', component: PageNotFoundComponent },
];
