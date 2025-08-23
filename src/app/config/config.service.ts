import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Data } from "@angular/router";
import { LoggerService } from "../core/logger.service";

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

  updateConfig(config: any): Observable<String> {
    return this.http.post(environment.apiUrl + "/conf/updateConfig",
      config, { "withCredentials": true, responseType: "text" });
  }

}
