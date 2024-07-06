import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http'

import {routes} from './app.routes';
import {requestInterceptor} from './request-interceptor';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withInterceptors([requestInterceptor])), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync()]
};
