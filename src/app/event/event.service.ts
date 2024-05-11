import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {EVENT} from './event';

@Injectable()
export class EventService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = "http://localhost:8080/api/events";
    // this.url = "https://everwen.fr.to/api/events";
  }

  getEvents(): Observable<EVENT[]> {
    return this.http.get<EVENT[]>(this.url);
  }
}
