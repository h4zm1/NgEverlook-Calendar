import {Injectable} from '@angular/core';
import {filter, map, Subject, Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EventBusService {

  private subject = new Subject<EventData>()

  constructor() {
  }

  emit(event: EventData) {
    this.subject.next(event)
  }

  sub(event: String, action: any): Subscription {
    return this.subject.pipe(
      // filter events coming through "subject" only pass the ones that match the name
      // through the pipe, if they don't pass the filter they won't go the next step (map)
      filter((e: EventData) => e.name === event),
      // extract the "value" property from the event
      map((e: EventData) => e["value"])
    ).subscribe(action)
  }
}

export class EventData {
  name: string;
  value: any;

  constructor(name: string, value: any) {
    this.name = name;
    this.value = value;
  }
}
