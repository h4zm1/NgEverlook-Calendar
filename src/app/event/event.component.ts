import { Component, inject, signal } from '@angular/core';
import { OnInit } from '@angular/core';
import { EventService } from './event.service';
import { EVENT } from './event';
import { NgClass } from '@angular/common';
import { EventToggleService } from '../core/event-toggle.service';
import { LoggerService } from '../core/logger.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-event',
  imports: [NgClass, NgxSkeletonLoaderModule],
  providers: [EventService],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
})
export class EventComponent implements OnInit {
  // events: EVENT[] | undefined;
  toggleService = inject(EventToggleService);
  events = this.toggleService.events;
  pre_events: EVENT[] | undefined;
  logger: LoggerService = inject(LoggerService);
  isLoading = signal(true);
  skeletonItems = Array(20)
    .fill(0)
    .map((_, i) => i);

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.eventService.getEvents().subscribe((data) => {
      this.pre_events = data;
      this.markFirstNewDate();
      this.isLoading.set(false);
    });
  }
  hasEnabledProperty(): boolean {
    return this.events().some(
      (event) =>
        event.ony ||
        event.mc ||
        event.bwl ||
        event.aq40 ||
        event.naxx ||
        event.zg ||
        event.aq20 ||
        event.dmf ||
        event.pvp ||
        event.k10 ||
        event.k40 ||
        event.es ||
        event.madness,
    );
  }
  // mark first new date to apply css class on it later
  // for blinking animation
  markFirstNewDate() {
    this.logger.log(this.pre_events);
    if (this.pre_events) {
      for (let event of this.pre_events) {
        if (event.old == null) {
          event.old = 2;
          break;
        }
      }
      // this.events = this.pre_events;
      this.toggleService.setEvents(this.pre_events);
      this.events = this.toggleService.events;
    }
    // load toggle state from localstorage (if they exist)
    // this had to be put here cause in oninit it wasn't triggering (on time)
    this.toggleService.loadStateFromStorage();
  }
}
