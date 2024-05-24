import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Observable} from "rxjs";
import {Boss} from "./boss";
import {environment} from "../../environments/environment";


@Injectable()
export class ZgbossService {

  constructor(private http: HttpClient) {
  }

  getBoss(): Observable<string> {
    return this.http.get(environment.apiUrl + "/api/zgboss", {responseType: "text"});
  }
}

