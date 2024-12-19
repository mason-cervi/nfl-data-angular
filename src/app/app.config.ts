import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(withFetch()), provideClientHydration(withEventReplay()), importProvidersFrom(HttpClientModule), provideCharts(withDefaultRegisterables()), provideAnimationsAsync('noop')]
};
