import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EVENT } from './event';
import { environment } from "../../environments/environment";

@Injectable()
export class EventService {
  private url!: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl
  }

  getEvents(): Observable<EVENT[]> {
    return this.http.get<EVENT[]>(this.url + "/api/events");
  }
}
