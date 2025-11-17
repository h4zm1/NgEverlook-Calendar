import { inject, Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { LoggerService } from "../core/logger.service";
import { ConfigValue } from './config-value.interface';

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
  getConfig(): Observable<ConfigValue> {
    return this.http.get<ConfigValue>(environment.apiUrl + "/conf/getConfig");
  }
}
