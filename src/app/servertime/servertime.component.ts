import {Component, inject} from '@angular/core';
import {SubscriptionLike} from "rxjs"
import {ServertimeService} from "./servertime.service";
import {OnDestroy} from "@angular/core";
import {LoggerService} from "../logger.service";

@Component({
  selector: 'app-servertime',
  standalone: true,
  imports: [],
  providers: [ServertimeService],
  templateUrl: './servertime.component.html',
  styleUrl: './servertime.component.css'
})
export class ServertimeComponent implements OnDestroy {
  logger: LoggerService = inject(LoggerService);
  private eventSourceSubscription: SubscriptionLike;
  time: string = ""

  constructor(private serverTimeService: ServertimeService) {
    this.eventSourceSubscription = this.serverTimeService.createSseSource().subscribe({
      next: data => {
        this.logger.log("SSE: " + data.data.toString())
        this.time = data.data.toString()
      }
    });
  }

  ngOnDestroy() {
    this.eventSourceSubscription.unsubscribe();
    this.serverTimeService.close();
  }
}
