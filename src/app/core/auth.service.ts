import {inject, Injectable} from '@angular/core';
import {catchError, Observable, tap, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {LoggerService} from "./logger.service";


export interface UserInfo {
  roles: Role[],
  email : string
}

interface Role {
  authority: string;
}

export interface AuthStatus{
  status : boolean,
  email : string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logger: LoggerService = inject(LoggerService);

  constructor(private http: HttpClient) {
  }

  login(email: String, password: String): Observable<UserInfo> {
    return this.http.post<UserInfo>(environment.apiUrl + "/auth/login",
      {email: email, password: password});
  }

  register(email: String, password: String): Observable<any> {
    return this.http.post(environment.apiUrl + "/auth/register",
      {email: email, password: password});
  }

  logout(): Observable<string> {
    return this.http.post(environment.apiUrl + "/auth/signout",
      {},{responseType: 'text'});
  }

  refreshToken(): Observable<string> {
    return this.http.post(environment.apiUrl + "/auth/refreshtoken", {}, {responseType: 'text'}).pipe(
      tap((response: string) => this.logger.log('Token refresh response:', response)),
      catchError(error => {
        this.logger.log('Token refresh failed:', error);
        return throwError(() => error);
      })
    );
  }

  // this will return (false) if the request didn't contain
  // jwt access token/cookie, or it will return (true)
  checkAuthStatus(): Observable<AuthStatus> {
    return this.http.get<AuthStatus>(environment.apiUrl + "/auth/status",
      {},)
  }
}
