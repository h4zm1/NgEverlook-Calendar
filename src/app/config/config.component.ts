import {Component, inject, OnInit} from '@angular/core';
import {ConfigService} from "./config.service";
import {EventBusService} from "./EventBus.service";
import {AuthService} from "../login/auth.service";
import {LoggerService} from "../logger.service";
import {FormsModule} from "@angular/forms";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerInputEvent,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatFormFieldModule, MatHint, MatLabel} from "@angular/material/form-field";
import {ThemeService} from "../theme.service";
import {CommonModule} from '@angular/common';
import {MatInput} from "@angular/material/input";
import {MatNativeDateModule} from "@angular/material/core";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [FormsModule, MatDatepicker,
    MatDatepickerToggle, MatFormFieldModule, MatNativeDateModule,
    MatHint, MatLabel, CommonModule, MatDatepickerInput, MatInput, MatButton],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent implements OnInit {
  confService: ConfigService = inject(ConfigService);
  eventBusService: EventBusService = inject(EventBusService);
  authService: AuthService = inject(AuthService);
  logger: LoggerService = inject(LoggerService);
  themeService: ThemeService = inject(ThemeService);

  date: String = ""
  configAccess = false
  savable = false

  ngOnInit() {
    const roles = localStorage.getItem("roles");
    if (roles && roles.includes("ADMIN")) {
      this.configAccess=true
    }
    // subscribe to eventBusService logout event, if something get published we call the logout method
    this.eventBusService.sub("logout", () => {
      this.logout()
    })
  }

  save() {
    const roles = localStorage.getItem("roles");
    if (roles && roles.includes("ADMIN")) {
      this.logger.log("saving " + this.date)
      this.confService.updateStartDate(this.date).subscribe({
        next: data => {
          this.logger.log("date from server " + data);
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
      },
      error: err => {
        this.logger.log("logout error " + err.error.message)
      }
    })
  }
}
