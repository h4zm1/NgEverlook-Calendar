import { Component } from '@angular/core';
import {OnInit} from '@angular/core';
import {EventService} from "./event.service";
import {EVENT} from "./event";
import {BossComponent} from "../boss/boss.component";
import {ServertimeComponent} from "../servertime/servertime.component";

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [
    BossComponent,
    ServertimeComponent
  ],
  providers:[EventService],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent implements OnInit{
  events :EVENT[] | undefined;

  constructor(private eventService: EventService) {
  }


  ngOnInit(){
    this.eventService.getEvents().subscribe(data =>
    this.events=data)
  }
}
