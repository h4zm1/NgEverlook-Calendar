import {Component} from '@angular/core';
import {SubscriptionLike} from "rxjs"
import {ServertimeService} from "./servertime.service";
import {OnDestroy} from "@angular/core";

@Component({
  selector: 'app-servertime',
  standalone: true,
  imports: [],
  providers: [ServertimeService],
  templateUrl: './servertime.component.html',
  styleUrl: './servertime.component.css'
})
export class ServertimeComponent implements OnDestroy {
  private eventSourceSubscription: SubscriptionLike;
  time: string = ""

  constructor(private serverTimeService: ServertimeService) {
    this.eventSourceSubscription = this.serverTimeService.createSseSource().subscribe({
      next: data => {
        console.log("SSE: " + data.data.toString())
        this.time = data.data.toString()
      }
    });
  }

  ngOnDestroy() {
    this.eventSourceSubscription.unsubscribe();
  }
}
