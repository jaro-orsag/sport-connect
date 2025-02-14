import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/in-memory-data.service';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withInMemoryScrolling({
            scrollPositionRestoration: 'enabled' // or 'top'
          })),
        provideAnimationsAsync(),
        importProvidersFrom(HttpClientModule),
        environment.isDevelopment
            ? 
                importProvidersFrom(HttpClientInMemoryWebApiModule.forRoot(
                    InMemoryDataService, 
                    { dataEncapsulation: false }
                )) 
            : 
            []
    ]
};
