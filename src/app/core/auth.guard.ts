import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../login/auth.service";
import {map, take} from "rxjs";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  return authService.checkAuthStatus().pipe(
    take(1), // only take the first emitted value and then unsubscribe
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true
      } else {
        router.navigate(['/login'])
        return false
      }
    })
  )
};
