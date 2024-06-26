import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";


@Injectable()
export class ZgbossService {

  constructor(private http: HttpClient) {
  }

  getBoss(): Observable<string> {
    return this.http.get(environment.apiUrl + "/api/zgboss", {responseType: "text"});
  }
}

