import { Component, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { EventService } from "./event.service";
import { EVENT } from "./event";
import { BossComponent } from "../boss/boss.component";
import { ServertimeComponent } from "../servertime/servertime.component";
import { CommonModule } from "@angular/common";
import { EventToggleService } from '../core/event-toggle.service';

@Component({
  selector: 'app-event',
  imports: [
    CommonModule,
    BossComponent,
    ServertimeComponent
  ],
  providers: [EventService],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent implements OnInit {
  // events: EVENT[] | undefined;
  toggleService = inject(EventToggleService)
  events = this.toggleService.events;
  pre_events: EVENT[] | undefined;

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    this.eventService.getEvents().subscribe(data => {
      this.pre_events = data;
      this.markFirstNewDate();
    })
  }

  // mark first new date to apply css class on it later
  // for blinking animation
  markFirstNewDate() {
    console.log(this.pre_events)
    if (this.pre_events) {
      for (let event of this.pre_events) {
        if (event.old == null) {
          event.old = 2;
          break;
        }
      }
      // this.events = this.pre_events;
      this.toggleService.setEvents(this.pre_events)
      this.events = this.toggleService.events
    }
    // load toggle state from localstorage (if they exist)
    // this had to be put here cause in oninit it wasn't triggering (on time)
    this.toggleService.loadStateFromStorage()
  }
}
