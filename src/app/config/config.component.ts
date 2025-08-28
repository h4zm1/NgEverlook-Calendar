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

@Component({
  selector: 'app-config',
  imports: [FormsModule, MatTooltip, MatButtonToggleModule,
    MatFormFieldModule, MatNativeDateModule, MatTimepickerModule, MatInputModule,
    MatHint, MatLabel, CommonModule, MatInput, MatButton, MatIcon, MatIconButton, RouterLink],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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
  selectedValues = {
    resetTime: '',
    m40: '',
    m20: '',
    ony: '',
    dmf: '',
    dmfLocation: '',
    madnessBoss: '',
    madnessWeek: ''
  };

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

  getRole(): string {
    if (localStorage.getItem("roles") != null && localStorage.getItem("roles") != "")
      return localStorage.getItem("roles")!.toString().substring(5)
    else
      return ""
  }

  save() {
    console.log('Selected days:', this.selectedValues);
    // const roles = localStorage.getItem("roles");
    // if (roles && roles.includes("ADMIN")) {
    //   // this.logger.log("saving " + this.date)
    //   this.configService.updateConfig(this.selectedValues).subscribe({
    //     next: data => {
    //       this.logger.log("server:: " + data);
    //     },
    //     error: err => {
    //       this.logger.log("conf error " + err.error.message)
    //     }
    //   })
    // }

  }
  // get 12 hour format from the time input field cause apparently it returns a long date format
  getTime12Hour(date: Date) {
    if (!date) this.selectedValues.resetTime = '';
    else
      this.selectedValues.resetTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
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
