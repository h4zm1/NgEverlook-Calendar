import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Observable} from "rxjs";
import {Boss} from "./boss";


@Injectable()
export class ZgbossService {
  private url: string;

  constructor(private http: HttpClient) {
    // this.url = "https://everwen.fr.to/api/zgboss";
    this.url = "http://localhost:8080/api/zgboss";
  }

  getBoss(): Observable<string> {
    return this.http.get(this.url,{responseType:"text"});
  }
}

