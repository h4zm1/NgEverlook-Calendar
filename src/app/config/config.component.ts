import {Component, inject, OnInit} from '@angular/core';
import {ConfigService} from "./config.service";
import {EventBusService} from "./EventBus.service";
import {AuthService} from "../login/auth.service";
import {LoggerService} from "../logger.service";

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent implements OnInit {
  confService: ConfigService = inject(ConfigService);
  eventBusService: EventBusService = inject(EventBusService);
  authService: AuthService = inject(AuthService);
  logger: LoggerService = inject(LoggerService);

  ngOnInit() {
    this.confService.updateStartDate("20/12/2024").subscribe({
      next: data => {
        this.logger.log("conf data " + data);
      },
      error: err => {
        this.logger.log("conf error " + err.error.message)
      }
    })
    this.eventBusService.sub("logout", () => {
      this.logout()
    })
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
