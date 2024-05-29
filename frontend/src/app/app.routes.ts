import { Routes } from '@angular/router';

export const menuRoutes: Routes = [
    { 
        path: 'player-need', 
        loadComponent: () => import('./pages/player-need-addition/player-need-addition.component').then(m => m.PlayerNeedAdditionComponent), 
        data: [{'title': 'Hľadám tím'}] 
    },
    { 
        path: 'team-need', 
        loadComponent: () => import('./pages/team-need-addition/team-need-addition.component').then(m => m.TeamNeedAdditionComponent),
        data: [{'title': 'Hľadáme hráča'}] 
    },
    { 
        path: 'terms-conditions', 
        loadComponent: () => import('./pages/terms-and-conditions/terms-and-conditions.component').then(m => m.TermsAndConditionsComponent),
        data: [{'title': 'Súhlasy'}] 
    },
    { 
        path: 'about-us', 
        loadComponent: () => import('./pages/about-us/about-us.component').then(m => m.AboutUsComponent),
        data: [{'title': 'O nás'}] 
    }
];

export const routes: Routes = [
    ...menuRoutes,
    { 
        path: 'player-need/:uuid', 
        loadComponent: () => import('./pages/player-need-detail/player-need-detail.component').then(m => m.PlayerNeedDetailComponent)
    },
    { 
        path: 'team-need/:uuid', 
        loadComponent: () => import('./pages/team-need-detail/team-need-detail.component').then(m => m.TeamNeedDetailComponent)
    },
    { 
        path: '', 
        loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
    },
    { 
        path: '**', 
        loadComponent: () => import('./pages/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)
    },
];
