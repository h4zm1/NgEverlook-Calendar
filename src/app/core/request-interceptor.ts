import { inject } from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from "@angular/common/http";
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { EventBusService, EventData } from "./EventBus.service";
import { LoggerService } from "./logger.service";

export const requestInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  let isRefreshing = false;
  const authService = inject(AuthService);
  const eventBusService = inject(EventBusService);
  let refreshTokenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  let logger = inject(LoggerService);
  const excludedEndpoints = [
    'getUsers',
    'auth/signin'
  ]

  req = req.clone({ // add withCredentials property to every request (send cookies with every request)
    withCredentials: true
  });

  logger.log("INTERCEPTOR")
  return next(req).pipe(
    catchError((error) => {
      const shouldSkip = excludedEndpoints.some(endpoint => req.url.includes(endpoint))
      if ( // handling expired access token when sending a request, conditions that necessitate a refresh:
        error instanceof HttpErrorResponse &&
        !shouldSkip &&
        error.status === 403 // server will manually send 403 error, as specified in it, this should mean token expired
      ) {
        logger.log('Caught 403 error, attempting to refresh token');
        return handle403Error(req, next);
      }
      return throwError(() => error);
    })
  );

  function handle403Error(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    // prevent multiple refresh attempts
    if (!isRefreshing) {
      isRefreshing = true;
      refreshTokenSubject.next(false);

      logger.log('Starting token refresh');
      return authService.refreshToken().pipe(
        switchMap((response: string) => { // successful response from refreshtoken endpoint
          logger.log('Token refreshed, retrying original request');
          isRefreshing = false;
          refreshTokenSubject.next(true); // retrying original request with new token
          return next(request);
        }),
        catchError((err) => {
          console.error('Token refresh failed:', err);
          isRefreshing = false;
          // refresh token also expired, so force logout
          if (err.status === 403) {
            eventBusService.emit(new EventData('logout', null));
          }
          return throwError(() => err);
        })
      );
    } else {
      // wait for the the current refresh to complete before retrying
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
