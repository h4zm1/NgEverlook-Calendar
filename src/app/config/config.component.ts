import {Component, inject, OnInit} from '@angular/core';
import {ConfigService} from "./config.service";
import {EventBusService} from "../core/EventBus.service";
import {AuthService} from "../login/auth.service";
import {LoggerService} from "../core/logger.service";
import {FormsModule} from "@angular/forms";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerInputEvent,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatFormFieldModule, MatHint, MatLabel} from "@angular/material/form-field";
import {ThemeService} from "../core/theme.service";
import {CommonModule} from '@angular/common';
import {MatInput} from "@angular/material/input";
import {MatNativeDateModule} from "@angular/material/core";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {Router, RouterLink} from "@angular/router";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [FormsModule, MatDatepicker, MatTooltip,
    MatDatepickerToggle, MatFormFieldModule, MatNativeDateModule,
    MatHint, MatLabel, CommonModule, MatDatepickerInput, MatInput, MatButton, MatIcon, MatIconButton, RouterLink],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent implements OnInit {
  confService: ConfigService = inject(ConfigService);
  eventBusService: EventBusService = inject(EventBusService);
  authService: AuthService = inject(AuthService);
  logger: LoggerService = inject(LoggerService);
  themeService: ThemeService = inject(ThemeService);
  router: Router = inject(Router);
  exitTip = "Log out"
  date: String = ""
  configAccess = false
  savable = false
  readonly minDate = new Date(2023, 11, 1);

  ngOnInit() {
    const roles = localStorage.getItem("roles");
    if (roles && roles.includes("ADMIN")) {
      this.configAccess = true
    }
    // subscribe to eventBusService logout event, if something get published under it we call the logout method
    this.eventBusService.sub("logout", () => {
      this.logout()
    })
    // if no local storage theme var available, make it light and save it
    if (localStorage.getItem("theme") == null) {
      this.themeService.setTheme("light")
      localStorage.setItem("theme", "light");
    }
    // if local var is dark, open the curtain and set theme to dark
    else {
      if (localStorage.getItem("theme") == "dark") {
        this.themeService.setTheme("dark")
      }
    }// if none of the above then it should be light
  }

  save() {
    const roles = localStorage.getItem("roles");
    if (roles && roles.includes("ADMIN")) {
      this.logger.log("saving " + this.date)
      this.confService.updateStartDate(this.date).subscribe({
        next: data => {
          this.logger.log("server:: " + data);
        },
        error: err => {
          this.logger.log("conf error " + err.error.message)
        }
      })
    }

  }

  dateChange(event: MatDatepickerInputEvent<Date>) {
    this.date = event.value?.toString()!!
    if (event.value) {
      const year = event.value.getFullYear();
      const month = (event.value.getMonth() + 1).toString().padStart(2, '0');
      const day = event.value.getDate().toString().padStart(2, '0');
      this.date = year + "-" + month + "-" + day
      this.logger.log(this.date)
    }
    this.savable = !!event.value;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: response => {
        this.logger.log("log out suc")
        this.logger.log(response)
        localStorage.removeItem("isLoggedIn")
        localStorage.removeItem("roles")
        this.router.navigate(["login"])
      },
      error: err => {
        this.logger.log("logout error")
        this.logger.error(err)
      }
    })
  }
}
