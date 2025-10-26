import { Injectable, signal } from '@angular/core';
import { EVENT } from '../event/event';

// this will be used to mass toggling that happen on site load/reload
interface EventState {
  property: keyof EVENT,
  enabled: boolean
}

@Injectable({
  providedIn: 'root'
})
export class EventToggleService {
  private toggleSignals = signal<EVENT[]>([]);
  events = this.toggleSignals.asReadonly()
  OG_events: EVENT[] = []

  // object to track toggle buttons states (in drop menu); to add new button just add new entry here
  // needed type annotation cause without it there was some type errors
  buttonStates: { [key: string]: boolean } = {
    ony: true,
    aq20: true,
    bwl: true,
    mc: true
  }
  setEvents(events: EVENT[]) {
    this.toggleSignals.set(events);
    this.OG_events = [...events];
  }
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
        return { // so this's object spreading, direct modification (with type assertion) is commented up, both works the same
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

  massToggle(states: EventState[]) {
    this.toggleSignals.update(events =>
      events.map(event => {
        const ogEvent = this.OG_events.find(og => og.id === event.id)
        let updatedEvent = { ...event } // create a copy of current evetn, with object spreading,
        // this's needed cause i will get errors that i can't assign stuff to event[e] (type never)
        // cause TS see "key of EVENT" and doesn't know if property is of date type, readyonly, or exist
        states.forEach(state => {
          updatedEvent = {
            ...updatedEvent,
            [state.property]: state.enabled ? ogEvent![state.property] : 0
          };
        });
        return updatedEvent
      })
    );
  }
  saveStateToStorage(property: string, enabled: boolean) {
    // get the saved states from localstorage if it exist
    const saved = localStorage.getItem("eventStates");
    // parse the saved state if it exist, if not? make an empty list
    const states = saved ? JSON.parse(saved) : {};

    // add or update property,
    // if the current property already there it will get updated or new one will get created
    // ex: states["ony"] = true
    states[property] = enabled

    // convert the updated object back to json and save it to localstorage
    localStorage.setItem("eventStates", JSON.stringify(states));
  }


  loadStateFromStorage() {
    const saved = localStorage.getItem("eventStates");

    if (saved) {
      const states = JSON.parse(saved);
      // object.entries will convert {ony: true, bwl: false} to:
      // [["ony", true], ["bwl", false]]
      // then loop over each property
      Object.entries(states).forEach(([property, enabled]) => {
        if (enabled) {
          this.enableEvent(property as keyof EVENT)
          this.buttonStates[property] = enabled as boolean
        }
        else {
          this.disableEvent(property as keyof EVENT)
          this.buttonStates[property] = enabled as boolean
        }
      })
    }
  }
}
