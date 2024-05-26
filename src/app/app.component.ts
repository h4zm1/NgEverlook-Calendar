import {Component} from '@angular/core';
import {RouterOutlet, RouterLink, RouterLinkActive, RouterModule} from '@angular/router';
import {BossComponent} from "./boss/boss.component";
import {EventComponent} from "./event/event.component";
import {ServertimeComponent} from "./servertime/servertime.component";
import {routes} from "./app.routes";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, RouterLink, RouterLinkActive, RouterModule,
    BossComponent, EventComponent, ServertimeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
}
