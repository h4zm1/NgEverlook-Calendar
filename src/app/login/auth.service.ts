import {inject, Injectable} from '@angular/core';
import {catchError, Observable, tap, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {LoggerService} from "../logger.service";

interface LoginResponse {
  token: string;
  expiresIn: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logger: LoggerService = inject(LoggerService);

  constructor(private http: HttpClient) {
  }

  login(email: String, password: String): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(environment.apiUrl + "/auth/login",
      {email: email, password: password});
  }

  register(email: String, password: String): Observable<any> {
    return this.http.post(environment.apiUrl + "/auth/register",
      {email: email, password: password});
  }

  logout(): Observable<any> {
    return this.http.post(environment.apiUrl + "/auth/logout",
      {},);
  }

  refreshToken(): Observable<string> {
    return this.http.post(environment.apiUrl + "/auth/refreshtoken", {}, { responseType: 'text' }).pipe(
      tap((response: string) => this.logger.log('Token refresh response:', response)),
      catchError(error => {
        this.logger.log('Token refresh failed:', error);
        return throwError(() => error);
      })
    );
  }
}
