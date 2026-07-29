import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tenantInterceptor } from '@agri-erp-workspace/auth';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from '../../libs/core/interceptors/auth.interceptor';
import { cacheInterceptor } from '../../libs/core/interceptors/cache.interceptor';
import { errorInterceptor } from '../../libs/core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
        provideBrowserGlobalErrorListeners(),
        provideAnimationsAsync(),
        provideRouter(appRoutes),
        provideHttpClient(withInterceptors([tenantInterceptor, authInterceptor, cacheInterceptor, errorInterceptor])),
        providePrimeNG({
      theme: {
        preset: Lara
      }
    })
  ]
};
