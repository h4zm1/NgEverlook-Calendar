import {Injectable} from '@angular/core';
import {NgZone} from '@angular/core';
import {Observable, Subscriber} from 'rxjs';


@Injectable()
export class ServertimeService {
  eventSource!: EventSource;

  constructor(private zone: NgZone) {
  }


  createSseSource(): Observable<MessageEvent> {
    if (this.eventSource) {
      this.eventSource.close()
    }
    this.eventSource = new EventSource("http://localhost:8080/api/time");

    return new Observable((subscriber: Subscriber<MessageEvent>) => {

      this.eventSource.onmessage = (event) => {
        this.zone.run(() => subscriber.next(event));
      };
      // skipping error handling since it seems like it's blocking the onmessage invoke
    });
  }


}
