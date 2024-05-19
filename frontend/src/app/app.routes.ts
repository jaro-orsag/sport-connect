import { Routes } from '@angular/router';
import { TeamNeedComponent } from './team-need/team-need.component';
import { PlayerNeedComponent } from './player-need/player-need.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const menuRoutes: Routes = [
    { path: 'player-need', component: PlayerNeedComponent, data: [{'title': 'Hľadám tím'}] },
    { path: 'team-need', component: TeamNeedComponent, data: [{'title': 'Hľadáme hráča'}]  }
];

export const routes: Routes = [
    ...menuRoutes,
    { path: '', redirectTo: '/player-need', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent },
];
