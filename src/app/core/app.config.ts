import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http'

import {routes} from './app.routes';
import {requestInterceptor} from './request-interceptor';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, NativeDateAdapter} from "@angular/material/core";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    {provide: DateAdapter, useClass: NativeDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS},
    provideHttpClient(withInterceptors([requestInterceptor])), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync()]
};
