import { Component, OnInit, inject } from '@angular/core';
import { ServertimeComponent } from "../servertime/servertime.component";
import { BossComponent } from "../boss/boss.component";
import { EventComponent } from "../event/event.component";
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule, MatAnchor, MatButton } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { ThemeService } from "../core/theme.service";
import { CommonModule } from '@angular/common';
import { LoggerService } from "../core/logger.service";
import { MatTooltip } from "@angular/material/tooltip";
import { AuthService } from "../core/auth.service";
import { LoginStatusService } from "../core/login-status.service";
import { EventToggleService } from '../core/event-toggle.service';

@Component({
  selector: 'app-home',
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
    MatTooltip,
    MatMenuModule,
    MatButtonToggleModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  logger: LoggerService = inject(LoggerService);
  title = 'NgEverlook-Calendar';
  themeService: ThemeService = inject(ThemeService);
  authService = inject(AuthService);
  toggleService = inject(EventToggleService);
  loginStatus = inject(LoginStatusService);
  router = inject(Router)
  // controlling Dark curtain style state: 1 = dark, 0 = light
  state = 0;
  configTip = "Settings";
  themeModTip = "Dark mode"
  gotoTip = "Jump to today"
  configClass = ""

  ngOnInit() {
    // if no local storage theme var available, make it light and save it
    if (localStorage.getItem('theme') == null) {
      this.themeService.setTheme("light")
      localStorage.setItem('theme', 'light');
      this.themeModTip = "Dark mode"
    }
    // if local var is dark, open the curtain and set theme to dark
    else {
      if (localStorage.getItem("theme") == "dark") {
        this.state = 1;
        this.themeService.setTheme("dark")
        this.themeModTip = "Light mode"
      }
      else if (localStorage.getItem("theme") == "light") {
        this.state = 0;
        this.themeService.setTheme("light")
        this.themeModTip = "Dark Mode"
      }
    }// if none of the above then it should be light
  }


  toggleTheme() {
    // wait a while till the dark curtain finish its animation then apply dark mode changes
    // and only wait 100ms when the curtain is turning off
    setTimeout(() => {
      this.themeService.updateTheme()
      localStorage.setItem("theme", this.themeService.themeSignal().toString());
      // 500 is how long the page wait till dark mode get applied (after curtain animation)
    }, this.themeService.themeSignal() === "light" ? 500 : 100)
    // to trigger the active state on the curtain html element
    this.state = this.state === 1 ? 0 : 1;
    this.themeModTip = this.state === 1 ? "Light mode" : "Dark Mode"
  }

  goToConfig() {
    // start config button spin animation on click
    this.configClass = "configButton"
    const storedLogin = localStorage.getItem("isLoggedIn");
    // this to avoid calling checkAuthStatus if isLoggedIn = false
    if (storedLogin != null && storedLogin == "true") {
      this.authService.checkAuthStatus().subscribe({
        next: isAuthenticated => {
          if (isAuthenticated.status) { // this means that the jwt token still valid (or a valid token refresh happened)
            this.logger.log("AUTO AUTHENTICATED")
            this.loginStatus.mail = isAuthenticated.email
            this.loginStatus.setJustLoggedIn(true)
            this.router.navigate(["config"])
          } else {
            this.logger.log("AUTO AUTHENTICATION denied")
            this.router.navigate(["login"])
          }
        },
        error: err => {
          this.logger.log("FAILED AUTO AUTHENTICATION")
          this.logger.error(err)
          this.router.navigate(["login"])
        }
      }
      );
    } else {
      this.router.navigate(["login"])
    }
  }
  scrollToToday() {
    const element = document.querySelector('[class="row first"]')
    console.log("found element to go", element);
    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
  onToggleChange(event: MatButtonToggleChange) {
    // console.log('toggled value ', event.source.value)
    console.log(event.source.value, ' is now ', event.source.checked)
    if (event.source.checked == true)
      this.toggleService.enableEvent(event.source.value)
    else
      this.toggleService.disableEvent(event.source.value)
  }
}
