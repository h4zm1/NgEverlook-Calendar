import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ConfigService } from "./config.service";
import { EventBusService } from "../core/EventBus.service";
import { AuthService } from "../core/auth.service";
import { LoggerService } from "../core/logger.service";
import { FormsModule } from "@angular/forms";
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatFormFieldModule, MatHint, MatLabel } from "@angular/material/form-field";
import { ThemeService } from "../core/theme.service";
import { CommonModule } from '@angular/common';
import { MatInput, MatInputModule } from "@angular/material/input";
import { MatNativeDateModule } from "@angular/material/core";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatTooltip } from "@angular/material/tooltip";
import { LoginStatusService } from "../core/login-status.service";
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ConfigValue, createEmptyConfig } from './config-value.interface';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-config',
  imports: [FormsModule, MatTooltip, MatButtonToggleModule,
    MatFormFieldModule, MatNativeDateModule, MatTimepickerModule, MatInputModule,
    MatHint, MatLabel, CommonModule, MatInput, MatButton, MatIcon, MatIconButton, RouterLink],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
})
export class ConfigComponent implements OnInit {
  configService: ConfigService = inject(ConfigService);
  eventBusService: EventBusService = inject(EventBusService);
  authService: AuthService = inject(AuthService);
  logger: LoggerService = inject(LoggerService);
  themeService: ThemeService = inject(ThemeService);
  router: Router = inject(Router);
  loginStatus: LoginStatusService = inject(LoginStatusService)
  exitTip = "Log out"
  roleTip = "Access Level"
  mailTip = "Email"
  date: string = ""
  configAccess = false
  savable = false
  readonly minDate = new Date(2023, 11, 1);
  email: string = ""
  protected readonly localStorage = localStorage;

  //days table for toggle groups
  daysOfWeek = [
    { value: 'Su', label: 'Su' },
    { value: 'Mo', label: 'Mo' },
    { value: 'Tu', label: 'Tu' },
    { value: 'We', label: 'We' },
    { value: 'Th', label: 'Th' },
    { value: 'Fr', label: 'Fr' },
    { value: 'Sa', label: 'Sa' }
  ];

  //tracking selected value for each group
  selectedValues: ConfigValue = createEmptyConfig()

  constructor(private activatedRoute: ActivatedRoute) {
    this.email = this.activatedRoute.snapshot.paramMap.get("email")!
  }

  ngOnInit() {
    this.logger.log("email from config " + this.loginStatus.mail);
    const roles = localStorage.getItem("roles");
    // even if this get altered the back will still need to verify the token validity
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
  ngAfterViewInit() {

    this.loadConfig()
  }
  getRole(): string {
    if (localStorage.getItem("roles") != null && localStorage.getItem("roles") != "")
      return localStorage.getItem("roles")!.toString().substring(5)
    else
      return ""
  }

  save() {
    console.log('Selected days:', this.selectedValues);
    // since the mat-timepicker need to be fed a Date value to be able to display time (apprently)
    // and since we need to have only the time in the database,
    // this result in converting back and forth between full Date value and time only value
    // when time get picked from ui it get converted and saved as a time (03:00 AM)
    // on save (here) normally we'd just take the saved value and sand it to back
    // but on load we need to have the input show the saved value so we need to convert that value to full date
    // the problem arise when we try to save without touching the input while it already have a value
    // now save (here) will pick up the full date format and not the time only
    // so need to invoke the convert to time method while considering both cases; 1: full date from load and 2: time only
    var date: any
    if (this.selectedValues.resetTime.toString().includes('Jan'))
      date = new Date(Date.parse(this.selectedValues.resetTime));
    else
      date = new Date(Date.parse("1/1/2000 " + this.selectedValues.resetTime));
    const roles = localStorage.getItem("roles");
    this.getTime12Hour(date)
    if (roles && roles.includes("ADMIN")) {
      // this.logger.log("saving " + this.date)
      this.configService.updateConfig(this.selectedValues).subscribe({
        next: data => {
          this.logger.log("server:: " + data);
        },
        error: err => {
          this.logger.log("conf error " + err.error.message)
        }
      })
    }
    this.convertStringToDate(this.selectedValues.resetTime)
  }
  // get 12 hour format from the time input field cause apparently it returns a long date format e.g.; 2000-01-01T03:30:00.000Z
  getTime12Hour(date: Date) {
    if (!date) this.selectedValues.resetTime = '';
    else
      this.selectedValues.resetTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
  }

  convertStringToDate(value: String) {
    const timestamp = Date.parse("1/1/2000 " + value);
    const date = new Date(timestamp)
    this.selectedValues.resetTime = date as any
  }

  loadConfig() {
    this.configService.getConfig().subscribe({
      next: (config) => {
        console.log("loaded configs:", config);
        this.selectedValues = config;
        // mat-timepicker expecting a Date object so need to convert the string to Date
        this.convertStringToDate(this.selectedValues.resetTime)
      },
      error: (error) => {
        console.error("error loading configs: ", error);
      }
    });
  }

  inputChange(event: any, type: String) {
    this.date = event.value?.toString()!!
    if (event instanceof Date) {
      this.logger.log("event type" + type)
      const year = event.getFullYear();
      const month = (event.getMonth() + 1).toString().padStart(2, '0');
      const day = event.getDate().toString().padStart(2, '0');
      this.date = year + "-" + month + "-" + day
      this.logger.log(this.date)
    } else if (type === 'dmf location') {
      this.logger.log("event type" + type)
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
        this.loginStatus.setJustLoggedIn(false)
        this.router.navigate(["login"])
      },
      error: err => {
        this.logger.log("logout error")
        this.logger.error(err)
      }
    })
  }

}
