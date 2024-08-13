import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {map, take} from "rxjs";
import {LoginStatusService} from "./login-status.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  const loginStatus: LoginStatusService = inject(LoginStatusService)
  // guarding pages that requires authentication, hence checkAuthStatus requires a valid token or valid refresh token

  // justLoggedIn check if user came from login page (with or without autologin)
  // to avoid calling checkAuthStatus since it should be already called in login page
  return loginStatus.justLoggedIn.pipe(
    map(justLoggedIn => {
      if (justLoggedIn) {
        return true
      } else {
        authService.checkAuthStatus().pipe(
          map(isAuthenticated => {
            if (isAuthenticated.status) {
              return true
            } else {
              router.navigate(["/login"])
              return false
            }
          })
        )
        router.navigate(["/login"])
        return false
      }
    })
  )
};
