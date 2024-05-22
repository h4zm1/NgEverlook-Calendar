import {Component, OnInit} from '@angular/core';
import {Boss} from "./boss";
import {ZgbossService} from "./zgboss.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-boss',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './boss.component.html',
  styleUrl: './boss.component.css',
  providers:[ZgbossService]
})
export class BossComponent implements OnInit{
  // zgBoss = inject(ZgbossService)
  boss : string =""
  state: string = "ON";
  changeState(){

    if(this.state === "ON")
      this.state = "OFF";
    else
    if(this.state === "OFF")
      this.state = "ON";
    console.log(this.state);

  }
  constructor(private bossService: ZgbossService) {
  }
  ngOnInit() {
    this.bossService.getBoss().subscribe(data => this.boss=data);
  }

}
