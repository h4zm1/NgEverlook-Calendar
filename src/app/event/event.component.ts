import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {EventService} from "./event.service";
import {EVENT} from "./event";
import {BossComponent} from "../boss/boss.component";
import {ServertimeComponent} from "../servertime/servertime.component";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-event',
  standalone: true,
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
  events: EVENT[] | undefined;
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
  markFirstNewDate(){
    if(this.pre_events){
      for(let event of this.pre_events){
          if(event.old == null){
            event.old = 2;
            break;
          }
      }
      this.events = this.pre_events;
    }
  }
}
