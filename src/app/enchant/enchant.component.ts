import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {ThemeService} from "../core/theme.service";

@Component({
  selector: 'app-enchant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enchant.component.html',
  styleUrl: './enchant.component.scss'
})
export class EnchantComponent implements OnInit{
  themeService: ThemeService = inject(ThemeService);
  ngOnInit(){
    // if no local storage theme var available, make it light and save it
    if (localStorage.getItem('theme') == null) {
      this.themeService.setTheme("light")
      localStorage.setItem('theme', 'light');
    }
    // if local var is dark, open the curtain and set theme to dark
    if (localStorage.getItem("theme") == "dark") {
      this.themeService.setTheme("dark")
    }
  }
}
