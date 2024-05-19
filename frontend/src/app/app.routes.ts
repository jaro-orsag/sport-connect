import { Routes } from '@angular/router';
import { TeamNeedComponent } from './team-need/team-need.component';
import { PlayerNeedComponent } from './player-need/player-need.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
    { path: 'player-need', component: PlayerNeedComponent },
    { path: 'team-need', component: TeamNeedComponent },
    { path: '', redirectTo: '/player-need', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent },
];
