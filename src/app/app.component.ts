import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BossComponent} from "./boss/boss.component";
import {EventComponent} from "./event/event.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BossComponent, EventComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'NgEverlook-Calendar';
}
