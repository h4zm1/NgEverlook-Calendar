import {Injectable} from '@angular/core';
import {BehaviorSubject, map, switchMap} from "rxjs";

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
  getJustLoggedIn(){
    return this.justLoggedIn.pipe(
      map(justLoggedIn => {
        console.log("login status "+justLoggedIn)
        return justLoggedIn
      })
    )
  }
}
