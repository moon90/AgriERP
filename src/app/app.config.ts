import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tenantInterceptor } from '@agri-erp-workspace/auth';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from '../../libs/core/interceptors/auth.interceptor'; // ইমপোর্ট করা হলো

export const appConfig: ApplicationConfig = {
  providers: [
        provideBrowserGlobalErrorListeners(),
        provideAnimationsAsync(), // অ্যানিমেশন চালু করা হলো
        provideRouter(appRoutes),
        provideHttpClient(withInterceptors([tenantInterceptor, authInterceptor])),
        providePrimeNG({
      theme: {
        preset: Lara
      }
    })
  ]
};
