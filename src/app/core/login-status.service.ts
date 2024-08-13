import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginStatusService {
  mail: string = ""
  private justLoggedInSource = new BehaviorSubject<Boolean>(false);
  justLoggedIn = this.justLoggedInSource.asObservable()

  setJustLoggedIn(value: boolean) {
    this.justLoggedInSource.next(value)
  }
}
