import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {ThemeService} from "../theme.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatFormFieldModule
    , MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  themeService: ThemeService = inject(ThemeService);
  hide = true;
  passwordValue: string = '';

  checkPasswordInput() {
    this.passwordValue = this.passwordValue.trim();
  }

}
