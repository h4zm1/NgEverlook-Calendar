import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoggerService } from '../core/logger.service';
import { ConfigValue } from './config-value.interface';
import { UserInfo } from '../core/auth.service';

export interface userToVet {
  id: number;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  logger: LoggerService = inject(LoggerService);

  constructor(private http: HttpClient) {}
  getUsers(): Observable<userToVet[]> {
    return this.http.get<userToVet[]>(environment.apiUrl + '/conf/getUsers');
  }
  setRole(vettedUser: userToVet): Observable<String> {
    return this.http.post(environment.apiUrl + '/conf/setRole', vettedUser, {
      responseType: 'text',
    });
  }
  updateConfig(config: any): Observable<String> {
    return this.http.post(environment.apiUrl + '/conf/updateConfig', config, {
      withCredentials: true,
      responseType: 'text',
    });
  }
  getConfig(): Observable<ConfigValue> {
    return this.http.get<ConfigValue>(environment.apiUrl + '/conf/getConfig', {
      withCredentials: true,
    });
  }
}
