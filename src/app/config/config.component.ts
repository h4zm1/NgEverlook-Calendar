import { Component, inject, OnInit } from '@angular/core';
import { ConfigService } from './config.service';
import { EventBusService } from '../core/EventBus.service';
import { AuthService } from '../core/auth.service';
import { LoggerService } from '../core/logger.service';
import { FormsModule } from '@angular/forms';
import { MatTimepickerModule } from '@angular/material/timepicker';
import {
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import {
  MatFormFieldModule,
  MatHint,
  MatLabel,
} from '@angular/material/form-field';
import { ThemeService } from '../core/theme.service';
import { CommonModule } from '@angular/common';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { LoginStatusService } from '../core/login-status.service';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { ConfigValue, createEmptyConfig } from './config-value.interface';
import { userToVet } from './config.service';

@Component({
  selector: 'app-config',
  imports: [
    FormsModule,
    MatTooltip,
    MatButtonToggleModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatFormFieldModule,
    MatNativeDateModule,
    MatTimepickerModule,
    MatInputModule,
    MatDatepickerModule,
    MatHint,
    MatLabel,
    CommonModule,
    MatInput,
    MatButton,
    MatIcon,
    MatIconButton,
  ],
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
  loginStatus: LoginStatusService = inject(LoginStatusService);
  exitTip = 'Log out';
  roleTip = 'Access Level';
  mailTip = 'Email';
  date: string = '';
  configAccess = false;
  savable = false;
  readonly minDate = new Date(2023, 11, 1);
  email: string = '';
  protected readonly localStorage = localStorage;
  usersToVet: userToVet[] = [];
  //days table for toggle groups
  daysOfWeek = [
    { value: 'Su', label: 'Su' },
    { value: 'Mo', label: 'Mo' },
    { value: 'Tu', label: 'Tu' },
    { value: 'We', label: 'We' },
    { value: 'Th', label: 'Th' },
    { value: 'Fr', label: 'Fr' },
    { value: 'Sa', label: 'Sa' },
  ];

  //tracking selected value for each group
  selectedValues: ConfigValue = createEmptyConfig();
  // will hold og config values
  ogConfigValues: ConfigValue = createEmptyConfig();

  constructor(private activatedRoute: ActivatedRoute) {
    this.email = this.activatedRoute.snapshot.paramMap.get('email')!;
  }

  ngOnInit() {
    this.logger.log('email from config ' + this.loginStatus.mail);
    const roles = localStorage.getItem('roles');
    // even if this get altered the back will still need to verify the token validity
    if (roles && roles.includes('ADMIN')) {
      this.configAccess = true;
    }
    // subscribe to eventBusService logout event, if something get published under it we call the logout method
    this.eventBusService.sub('logout', () => {
      this.logout();
    });
    // if no local storage theme var available, make it light and save it
    if (localStorage.getItem('theme') == null) {
      this.themeService.setTheme('light');
      localStorage.setItem('theme', 'light');
    }
    // if local var is dark, open the curtain and set theme to dark
    else {
      if (localStorage.getItem('theme') == 'dark') {
        this.themeService.setTheme('dark');
      } else this.themeService.setTheme('light');
    }

    // retrieve user list for role change
    this.configService.getUsers().subscribe({
      next: (users: userToVet[]) => {
        this.usersToVet = users.map((user) => ({
          ...user,
          role: user.role.replace('ROLE_', ''),
        }));
      },
    });
  }
  ngAfterViewInit() {
    this.loadConfig();
  }
  getRole(): string {
    if (
      localStorage.getItem('roles') != null &&
      localStorage.getItem('roles') != ''
    )
      return localStorage.getItem('roles')!.toString().substring(5);
    else return '';
  }

  roleChanged(event: MatButtonToggleChange, email: string, id: number) {
    const role: string = 'ROLE_' + event.value;
    this.logger.log(
      'change roll for ',
      id,
      ' to ',
      role,
      ' with this email ',
      email,
    );
    var userVetted: userToVet = { id: id, role: role, email: email };
    this.configService.setRole(userVetted).subscribe({
      next: (data) => {
        this.logger.log('role change server::' + data);
      },
      error: (err) => {
        this.logger.log('role change error' + err.error.message);
      },
    });
  }

  save() {
    this.logger.log('Selected days:', this.selectedValues);

    const roles = localStorage.getItem('roles');
    // convert time to short format for DB
    this.setTime12Hour();
    this.logger.log('SELECTED VALUES:', this.selectedValues);
    if (roles && roles.includes('ADMIN')) {
      // this.logger.log("saving " + this.date)

      this.configService.updateConfig(this.selectedValues).subscribe({
        next: (data) => {
          this.logger.log('server:: ' + data);
        },
        error: (err) => {
          this.logger.log('conf error ' + err.error.message);
        },
      });
    }
    // set time value back to full date format
    this.convertStringToDate();
    // update og values
    this.ogConfigValues = { ...this.selectedValues };
  }
  // get 12 hour format from the time input field cause apparently it returns a long date format e.g.; 2000-01-01T03:30:00.000Z
  setTime12Hour() {
    var Rdate: Date;
    Rdate = new Date(Date.parse(this.selectedValues.resetTime));
    this.selectedValues.resetTime = Rdate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  convertStringToDate() {
    // prepend 1/1/2000 to make it the time (string) from db parseable
    // ex: "3:30 PM" => "1/1/2000 3:30 PM" => Date object
    const Rtimestamp = Date.parse('1/1/2000 ' + this.selectedValues.resetTime);
    this.selectedValues.resetTime = new Date(Rtimestamp) as any;
    const startDate = Date.parse(this.selectedValues.startDate);
    this.selectedValues.startDate = new Date(startDate) as any;
  }

  loadConfig() {
    this.configService.getConfig().subscribe({
      next: (config) => {
        this.selectedValues = { ...config };
        // mat-timepicker expecting a Date object so need to convert the string to Date
        this.convertStringToDate();
        this.ogConfigValues = { ...this.selectedValues };
        this.createChangeDetectionProxy();
      },
      error: (error) => {
        console.error('error loading configs: ', error);
      },
    });
  }
  // create a handler that define what happen when a property change (intercept changes)
  createChangeDetectionProxy() {
    const handler = {
      set: (target: any, property: any, value: any) => {
        this.logger.log(
          `Property ${property} changed from ${target[property]} to ${value}`,
        );
        // target = this will be selectedValues
        // property = this will be resetTime, m40, ony..
        // value = this's the new value being set
        target[property] = value; // update property
        this.detectChanges(); //run change detection
        return true;
      },
    };
    // wrape object with a proxy
    this.selectedValues = new Proxy(this.selectedValues, handler);
  }

  detectChanges() {
    // savable = true when both objects are different
    this.savable =
      JSON.stringify(this.selectedValues) !==
      JSON.stringify(this.ogConfigValues);
    // this.logger.log("reset ", this.selectedValues.resetTime, "OG reset ", this.ogConfigValues.resetTime, " savable:: ", this.savable)
  }
  isFieldChanged(value: keyof ConfigValue): boolean {
    // apparently the initial date parse am doing at lead is adding an extra hour to the date
    // and dates from picker don't have that extra hour, so here we needed to compared only date values (.toSateString())
    if (value === 'startDate') {
      const og = new Date(this.ogConfigValues.startDate);
      const current = new Date(this.selectedValues.startDate);
      return og.toDateString() !== current.toDateString();
    }
    // .toString is needed or else the comparison won't work right
    return (
      this.selectedValues[value]?.toString() !==
      this.ogConfigValues[value]?.toString()
    );
  }
  logout(): void {
    this.authService.logout().subscribe({
      next: (response) => {
        this.logger.log('log out suc');
        this.logger.log(response);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('roles');
        this.loginStatus.setJustLoggedIn(false);
        this.router.navigate(['login']);
      },
      error: (err) => {
        this.logger.log('logout error');
        this.logger.error(err);
      },
    });
  }
}
