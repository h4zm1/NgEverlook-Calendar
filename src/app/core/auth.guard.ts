import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {catchError, map, of, switchMap, take} from "rxjs";
import {LoginStatusService} from "./login-status.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  const loginStatus: LoginStatusService = inject(LoginStatusService)

  // guarding pages that requires authentication, hence checkAuthStatus requires a valid token or valid refresh token

  // justLoggedIn check if user came from login page (with or without autologin)
  // to avoid calling checkAuthStatus since it should be already called in login page
  return loginStatus.justLoggedIn.pipe(
    // switchmap to switch to a new Observable based on the justLoggedIn value
    switchMap(justLoggedIn => {
      if (justLoggedIn) {
        // if user just logged in, allow access without further checks
        return of(true);
      } else {
        // if user didn't just log in, check their authentication status
        return authService.checkAuthStatus().pipe(
          map(isAuthenticated => {
            if (isAuthenticated.status) {
              // if authenticated, allow access
              loginStatus.mail = isAuthenticated.email
              return true;
            } else {
              // if not authenticated, navigate to login page and deny access
              router.navigate(["/login"]);
              return false;
            }
          })
        );
      }
    }),
    // in case an error happened during the authentication process
    catchError(() => {
      router.navigate(["/login"]);
      return of(false);
    })
  );
};
