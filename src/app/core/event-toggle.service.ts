import { Injectable, signal } from '@angular/core';
import { EVENT } from '../event/event';

@Injectable({
  providedIn: 'root'
})
export class EventToggleService {
  private toggleSignals = signal<EVENT[]>([]);
  events = this.toggleSignals.asReadonly()
  OG_events: EVENT[] = []
  setEvents(events: EVENT[]) {
    this.toggleSignals.set(events);
    this.OG_events = [...events];
  }

  // addEvent(e: keyof EVENT) {
  //   // this.toggleSignal.update(events => [...events, event])
  //   console.log("inside addEvent", e)
  //   const eventsToAdd = this.OG_events.filter(event => event[e] == 1)
  //   this.toggleSignals.update(events => [...this.toggleSignals(), ...eventsToAdd])
  // }
  // removeEvent(e: keyof EVENT) {
  //   this.toggleSignals.update(events => // .filter will create a list (trim down/delete events) bases on () condition
  //     // here will retun a list excludig events where event[e] equals 1
  //     events.filter(event => event[e] !== 1) // if e = "ony" event[e] will be the same as event.ony
  //   );
  //   console.log('AFTER REMOVING ${e} ', this.toggleSignals())
  // }
  //

  enableEvent(e: keyof EVENT) {
    // using .update instead of .set here on the signal cause it's much cleaner
    // when using .set we need to get the current value (list) from within the signal
    // do a .map on the list we extracted, modify it, and then do .set(modifiedEvents)
    this.toggleSignals.update(events => // events => means take the list (the one side signal) and do something with it
      events.map(event => { // .map will go through every event, modify them and return new list wit all changed events

        // getting the same event from og_events (untouched event list)
        const ogEvent = this.OG_events.find(og => og.id === event.id);
        // (event as any)[e] = ogEvent[e]
        // return event

        // using explicit return here cause we needing multiple statements (finding og event first)
        // or else i could'v made it like this:    events.map(event => ({ ...event, [e]: this.OG_events...etc })) which is less clearer
        return { // so this's object spreading, commened direct method is commented up, both works the same
          ...event, // this will copy ALL preperties
          [e]: ogEvent // this will override the [e] property only
        }
      })
    );
  }

  disableEvent(e: keyof EVENT) {
    this.toggleSignals.update(events =>
      events.map(event => ({ // opening paranthesis here since we'r not doing explicit return, cause there only one statement
        ...event, // spread the object
        [e]: 0 // only set the [e] property to 0
      })
      )
    )
  }
  updateEvent(event: String) {

  }
}
