import { Component, ElementRef, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../core/theme.service';
import { Router } from '@angular/router';
import { AuthService, UserInfo } from '../core/auth.service';
import { LoggerService } from '../core/logger.service';
import { LoginStatusService } from '../core/login-status.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltip,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  logger: LoggerService = inject(LoggerService);
  themeService: ThemeService = inject(ThemeService);
  loginStatus: LoginStatusService = inject(LoginStatusService);
  hide = true;
  isJoining = false;
  signLinkText = 'Need access?';
  signBtnText = 'Log In';
  accessRequest = false;
  passwordInputText = 'Password';
  credentials = { email: '', password: '' };
  authService = inject(AuthService);
  router: Router = inject(Router);
  correct = '';
  isPasswordFocused = false;
  lvlColors = ['lightgray', 'lightgray', 'lightgray', 'lightgray'];
  popoverMessage = 'Must have at least 6 characters.';
  validPwd = false;
  validMail = false;
  upperLowerCaseCheck = false;
  symbolCheck = false;
  normalTextCheck = false;
  numberCheck = false;
  showNotif = false;
  statusNotif = '';
  goBackTip = 'Go To Events';
  constructor(private el: ElementRef) {}

  checkPasswordInput() {
    this.credentials.password = this.credentials.password.trim();
    this.validPwd = false;

    // check all conditions
    const length = this.credentials.password.length;
    this.normalTextCheck = /[a-z]/.test(this.credentials.password);
    this.upperLowerCaseCheck = /[A-Z]/.test(this.credentials.password);
    this.numberCheck = /[1-9]/.test(this.credentials.password);
    this.symbolCheck = /[^a-zA-Z1-9]/.test(this.credentials.password);

    // this will return how many conditions all true
    const specialConditions = [
      this.upperLowerCaseCheck,
      this.numberCheck,
      this.symbolCheck,
      this.normalTextCheck,
    ].filter(Boolean).length;

    if (length < 7) {
      this.popoverMessage = 'Must have at least 7 characters.';
      this.lvlColors = ['lightgray', 'lightgray', 'lightgray', 'lightgray'];
      this.validPwd = false;
    } else if (length >= 7 && specialConditions === 1) {
      // only length condition is met
      this.popoverMessage = 'Weak Password';
      this.lvlColors = ['#ff5901', 'lightgray', 'lightgray', 'lightgray'];
      this.validPwd = true;
    } else if (specialConditions === 2) {
      // only one of the special conditions is met
      this.popoverMessage = 'Average Password';
      this.lvlColors = ['#ffb808', '#ffb807', 'lightgray', 'lightgray'];
      this.validPwd = true;
    } else if (specialConditions == 3) {
      // only 3 specials are mets
      this.popoverMessage = 'Good Password';
      this.lvlColors = ['#01d25a', '#00d25a', '#00d25a', 'lightgray'];
      this.validPwd = true;
    } else if (specialConditions == 4) {
      // all conditions are met
      this.popoverMessage = 'Strong Password';
      this.lvlColors = ['#01a87e', '#00a87e', '#00a87e', '#00a87e'];
      this.validPwd = true;
    }
  }
  checkMailInput(input: HTMLInputElement) {
    this.logger.log('valid mail? ', input.validity.valid);
    this.validMail = input.validity.valid;
  }
  // switching between sign in or sign up ui/events
  signInOrUp() {
    // unfocus any selected element (needed for uncofusing password after hitting enter on registering)
    (document.activeElement as HTMLElement)?.blur();
    this.isJoining = !this.isJoining;
    this.signLinkText = this.isJoining
      ? 'Already have account? Sign in'
      : 'Need access?';
    this.signBtnText = this.isJoining ? 'Request Access' : 'Log in';
    this.passwordInputText = this.isJoining ? 'Secured password' : 'Password';
    this.logger.log('test');
    // resetting input fields
    this.credentials.email = '';
    this.credentials.password = '';
    this.validMail = false;
    this.validPwd = false;
    // make sure the pop is updated to an empty field
    this.checkPasswordInput();
  }

  ngOnInit() {
    // no need to force an auto login here in case an account switch is needed
    // if no local storage theme var available, make it light and save it
    if (localStorage.getItem('theme') == null) {
      this.themeService.setTheme('light');
      localStorage.setItem('theme', 'light');
    }
    // if local var is dark, open the curtain and set theme to dark
    else {
      if (localStorage.getItem('theme') == 'dark') {
        this.themeService.setTheme('dark');
      }
    } // if none of the above then it should be light
  }

  getUserRolesAsString(userInfo: UserInfo): string {
    return userInfo.roles.map((role) => role.authority).join(',');
  }
  notif(value: string) {
    this.statusNotif = value;
    this.showNotif = true;
    setTimeout(() => {
      this.showNotif = false;
    }, 8001);
  }
  goBack() {
    this.logger.log('GO BACK');
    this.router.navigate(['/']);
  }
  onSubmit() {
    const email = this.credentials.email;
    const password = this.credentials.password;
    this.logger.log(this.credentials.email, this.credentials.password);
    if (this.isJoining) {
      // register
      this.notif(
        'You will receive an email notification once access has been granted.',
      );
      this.signInOrUp();
      this.authService.register(email, password).subscribe({
        next: (data) => {
          this.logger.log('reg ***** ' + data.toString());
          // switch to sign in ui after successful registering
          this.signInOrUp();
        },
        error: (err) => {
          this.logger.log(err.error.message);
        },
      });
    } // login
    else
      this.authService
        .login(this.credentials.email, this.credentials.password)
        .subscribe({
          next: (data) => {
            this.loginStatus.setJustLoggedIn(true);
            this.loginStatus.mail = data.email;
            this.router.navigate(['config']);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('roles', this.getUserRolesAsString(data));
            this.logger.log('login*** ' + this.getUserRolesAsString(data));
            this.logger.log('email ' + data.email);
          },
          error: (err) => {
            if (
              err.status === 401 &&
              err.error?.errorCode === 'ROLE_RESTRICTED'
            ) {
              // user logged in with "USER" role
              this.logger.log('Access restricted: ', err.error.error);
              this.notif(err.error.error);
            } else if (
              err.status == 401 &&
              err.error?.errorCode === 'BAD_CREDENTIALS'
            ) {
              this.notif(err.error.error);
            } else if (err.status === 401) {
              // bad credentials
              this.logger.log('Invalid credentials');
            } else if (err.error?.errorCode === 'MANY_ATTEMPTS') {
              this.notif(err.error.error);
            }
          },
        });
  }

  passwordFocused() {
    // only shows password helped when demanding access
    if (this.isJoining) this.isPasswordFocused = true;
    this.logger.log('focus called');
  }

  passwordUnFocused() {
    this.isPasswordFocused = false;
    this.logger.log('passwordUnFocused');
  }
}
