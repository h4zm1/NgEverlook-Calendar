import {inject, Injectable} from '@angular/core';
import {Observable, shareReplay} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Data} from "@angular/router";
import {LoggerService} from "../logger.service";

// interface LoginResponse {
//   token: string;
//   expiresIn: string;
// }


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  logger: LoggerService = inject(LoggerService);

  constructor(private http: HttpClient) {
  }

  updateStartDate(date: String): Observable<String> {
    return this.http.post(environment.apiUrl + "/conf/updateStartDate",
      {date: date}, {"withCredentials": true, responseType:"text"});
  }

}
