import { Routes } from '@angular/router';
import { TeamNeedAdditionComponent } from './pages/team-need-addition/team-need-addition.component';
import { PlayerNeedAdditionComponent } from './pages/player-need-addition/player-need-addition.component';
import { PlayerNeedDetailComponent } from './pages/player-need-detail/player-need-detail.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { LandingComponent } from './pages/landing/landing.component';

export const menuRoutes: Routes = [
    { path: 'player-need', component: PlayerNeedAdditionComponent, data: [{'title': 'Hľadám tím'}] },
    { path: 'team-need', component: TeamNeedAdditionComponent, data: [{'title': 'Hľadáme hráča'}] },
    { path: 'terms-conditions', component: TermsAndConditionsComponent, data: [{'title': 'Súhlasy'}] },
    { path: 'about-us', component: AboutUsComponent, data: [{'title': 'O nás'}] }
];

export const routes: Routes = [
    ...menuRoutes,
    { path: 'player-need/:uuid', component: PlayerNeedDetailComponent },
    { path: '', component: LandingComponent },
    { path: '**', component: PageNotFoundComponent },
];
