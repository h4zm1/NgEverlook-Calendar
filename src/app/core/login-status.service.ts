import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, switchMap } from "rxjs";
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class LoginStatusService {
  mail: string = ""
  private justLoggedInSource = new BehaviorSubject<Boolean>(false);
  justLoggedIn = this.justLoggedInSource.asObservable()
  logger: LoggerService = inject(LoggerService);
  setJustLoggedIn(value: boolean) {
    this.justLoggedInSource.next(value)
  }
  getJustLoggedIn() {
    return this.justLoggedIn.pipe(
      map(justLoggedIn => {
        this.logger.log("login status " + justLoggedIn)
        return justLoggedIn
      })
    )
  }
}
