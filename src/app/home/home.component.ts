import {Component, OnInit, inject} from '@angular/core';
import {ServertimeComponent} from "../servertime/servertime.component";
import {BossComponent} from "../boss/boss.component";
import {EventComponent} from "../event/event.component";
import {RouterModule} from '@angular/router';
import {MatButtonModule, MatAnchor, MatButton} from "@angular/material/button";
import {MatIconModule} from '@angular/material/icon';
import {ThemeService} from "../theme.service";
import {CommonModule} from '@angular/common';
import {LoggerService} from "../logger.service";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [
        RouterModule,
        ServertimeComponent,
        BossComponent,
        EventComponent,
        CommonModule,
        MatButton,
        MatAnchor,
        MatIconModule,
        MatButtonModule,
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  logger: LoggerService = inject(LoggerService);
  title = 'NgEverlook-Calendar';
  themeService: ThemeService = inject(ThemeService);
  // activeTheme: string = "light"
  state = 0; // 1 = dark, 0 = light

  ngOnInit() {
    // if no local storage theme var available, make it light and save it
    if (localStorage.getItem('theme') == null) {
      this.themeService.setTheme("light")
      localStorage.setItem('theme', 'light');
    }
    this.logger.log(localStorage.getItem("theme"));
    // if local var is dark, open the curtain and set theme to dark
    if (localStorage.getItem("theme") == "dark") {
      this.state = 1;
      this.themeService.setTheme("dark")
    }
  }


  toggleTheme() {
    // wait a while till the dark curtain finish its animation then apply dark mode changes
    // and only wait 100ms when the curtain is turning off
    setTimeout(() => {
      this.themeService.updateTheme()
      localStorage.setItem("theme", this.themeService.themeSignal().toString());
    }, this.themeService.themeSignal() === "light" ? 500 : 100)
    // to trigger the active state on the curtain html element
    this.state = this.state === 1 ? 0 : 1;

  }
}
