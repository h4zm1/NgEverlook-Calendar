import { Component } from '@angular/core';
import {ServertimeComponent} from "../servertime/servertime.component";
import {BossComponent} from "../boss/boss.component";
import {EventComponent} from "../event/event.component";
import { RouterModule } from '@angular/router';
import {MatAnchor, MatButton} from "@angular/material/button";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    ServertimeComponent,
    BossComponent,
    EventComponent,
    MatButton,
    MatAnchor
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  title = 'NgEverlook-Calendar';

}
