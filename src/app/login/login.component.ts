import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {ThemeService} from "../theme.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatFormFieldModule
    , MatButtonModule, MatIconModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  themeService: ThemeService = inject(ThemeService);
  hide = true;
  passwordValue: string = '';

  checkPasswordInput() {
    this.passwordValue = this.passwordValue.trim();
  }

  ngOnInit() {
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

