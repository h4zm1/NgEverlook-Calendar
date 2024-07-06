import {Component, inject, OnInit} from '@angular/core';
import {Boss} from "./boss";
import {ZgbossService} from "./zgboss.service";
import {NgIf} from "@angular/common";
import {ConfigService} from "../config/config.service";
import {LoggerService} from "../logger.service";

@Component({
  selector: 'app-boss',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './boss.component.html',
  styleUrl: './boss.component.scss',
  providers:[ZgbossService]
})
export class BossComponent implements OnInit{
  // zgBoss = inject(ZgbossService)
  logger: LoggerService = inject(LoggerService);
  boss : string =""
  state: string = "ON";
  changeState(){

    if(this.state === "ON")
      this.state = "OFF";
    else
    if(this.state === "OFF")
      this.state = "ON";
    this.logger.log(this.state);

  }
  constructor(private bossService: ZgbossService) {
  }
  ngOnInit() {
    this.bossService.getBoss().subscribe(data => this.boss=data);
  }

}
