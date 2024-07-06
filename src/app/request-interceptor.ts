import {inject} from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from "@angular/common/http";
import {BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError} from "rxjs";
import {AuthService} from "./login/auth.service";
import {EventBusService, EventData} from "./config/EventBus.service";
import {LoggerService} from "./logger.service";

export const requestInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  let isRefreshing = false;
  const authService = inject(AuthService);
  const eventBusService = inject(EventBusService);
  let refreshTokenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  let logger = inject(LoggerService);

  req = req.clone({
    withCredentials: true
  });

  return next(req).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        !req.url.includes('auth/signin') &&
        error.status === 403
      ) {
        logger.log('Caught 403 error, attempting to refresh token');
        return handle403Error(req, next);
      }
      return throwError(() => error);
    })
  );

  function handle403Error(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshTokenSubject.next(false);

      logger.log('Starting token refresh');
      return authService.refreshToken().pipe(
        switchMap((response: string) => {
          logger.log('Token refreshed, retrying original request');
          isRefreshing = false;
          refreshTokenSubject.next(true);
          return next(request);
        }),
        catchError((err) => {
          console.error('Token refresh failed:', err);
          isRefreshing = false;
          if (err.status === 403) {
            eventBusService.emit(new EventData('logout', null));
          }
          return throwError(() => err);
        })
      );
    } else {
      logger.log('Waiting for token refresh to complete');
      return refreshTokenSubject.pipe(
        filter(refreshed => refreshed),
        take(1),
        switchMap(() => {
          logger.log('Token refresh completed, retrying original request');
          return next(request);
        })
      );
    }
  }
};
