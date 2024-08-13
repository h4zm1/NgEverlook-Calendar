import {Component, inject, OnInit} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";
import {ThemeService} from "../core/theme.service";
import {Router, RouterLink} from "@angular/router";
import {AuthService, UserInfo} from "../core/auth.service";
import {routes} from "../core/app.routes";
import {LoggerService} from "../core/logger.service";
import {LoginStatusService} from "../core/login-status.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule, MatInputModule, MatFormFieldModule
    , MatButtonModule, MatIconModule, CommonModule, RouterLink],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss"
})
export class LoginComponent implements OnInit {
  logger: LoggerService = inject(LoggerService);
  themeService: ThemeService = inject(ThemeService)
  loginStatus : LoginStatusService = inject(LoginStatusService)
  hide = true
  isJoining = false
  signLinkText = "Sign up"
  signBtnText = "Log in"
  accessRequest = false
  passwordInputText = "Password";
  credentials = {email: "", password: ""};
  authService = inject(AuthService);
  router: Router = inject(Router);
  correct = "";
  isPasswordFocused = false
  lvlColors = ["lightgray", "lightgray", "lightgray", "lightgray"]
  popoverMessage = "Must have at least 6 characters."


  checkPasswordInput() {
    this.credentials.password = this.credentials.password.trim();

    // this for the bars highlights inside the popover (basic)
    length = this.credentials.password.length;
    if (length < 6) {
      this.popoverMessage = "Must have at least 6 \ncharacters."
      this.lvlColors = ['lightgray', 'lightgray', 'lightgray', 'lightgray']
    } else if (6 <= length && length < 9) {
      this.popoverMessage = "Weak Password"
    } else if (9 <= length && length < 11) {
      this.popoverMessage = "Weak Password"
      this.lvlColors = ['#ff5900', 'lightgray', 'lightgray', 'lightgray']
    } else if (11 <= length && length < 14) {
      this.popoverMessage = "Average Password"
      this.lvlColors = ['#ffb807', '#ffb807', '#lightgray', 'lightgray']
    } else if (14 <= length && length < 16) {
      this.popoverMessage = "Good Password"
      this.lvlColors = ['#00d25a', '#00d25a', '#00d25a', 'lightgray']
    } else {
      this.popoverMessage = "Strong Password"
      this.lvlColors = ['#00a87e', '#00a87e', '#00a87e', '#00a87e']
    }
  }

  // switching between sign in or sign up ui/events
  signInOrUp() {
    this.isJoining = !this.isJoining
    this.signLinkText = this.isJoining ? "Already have account? Sign in" : "Sign up"
    this.signBtnText = this.isJoining ? "Request Access" : "Log in"
    this.passwordInputText = this.isJoining ? "Secured password" : "Password"
    this.logger.log("test")
    // resetting input fields
    this.credentials.email = ""
    this.credentials.password = ""
  }

  ngOnInit() {
    if (localStorage.getItem("isLoggedIn") != null) {
      if (localStorage.getItem("isLoggedIn") == "true") {
        this.authService.checkAuthStatus().subscribe({
            next: isAuthenticated => {
              if (isAuthenticated.status) { // this means that the jwt token still valid (or a valid token refresh happened)
                this.logger.log("AUTO AUTHENTICATED")
                this.loginStatus.mail=isAuthenticated.email
                this.loginStatus.setJustLoggedIn(true)
                this.router.navigate(["config"])
              } else {
                this.logger.log("AUTO AUTHENTICATION denied")
              }
            },
            error: err => {
              this.logger.log("FAILED AUTO AUTHENTICATION")
              this.logger.error(err)
            }
          }
        );
      }
    }
    // if no local storage theme var available, make it light and save it
    if (localStorage.getItem("theme") == null) {
      this.themeService.setTheme("light")
      localStorage.setItem("theme", "light");
    }
    // if local var is dark, open the curtain and set theme to dark
    else {
      if (localStorage.getItem("theme") == "dark") {
        this.themeService.setTheme("dark")
      }
    }// if none of the above then it should be light
  }

  getUserRolesAsString(userInfo: UserInfo): string {
    return userInfo.roles.map(role => role.authority).join(",");
  }

  onSubmit() {
    this.logger.log(this.credentials.email, this.credentials.password);
    if (this.isJoining) // register
      this.authService.register(this.credentials.email, this.credentials.password)
        .subscribe({
          next: (data) => {
            this.logger.log("reg ***** " + data.toString());
            // switch to sign in ui after successful registering
            this.signInOrUp()
          },
          error: err => {
            this.logger.log(err.error.message)
          }
        })
    else // login
      this.authService.login(this.credentials.email, this.credentials.password)
        .subscribe({
          next: data => {
            this.loginStatus.setJustLoggedIn(true)
            this.loginStatus.mail=data.email
            this.router.navigate(["config"])
            localStorage.setItem("isLoggedIn", "true")
            localStorage.setItem("roles", this.getUserRolesAsString(data))
            this.logger.log("login*** " + this.getUserRolesAsString(data));
            this.logger.log("email "+data.email)
          },
          error: err => {
            this.logger.log(err.error.message)
          }
        })
  }


  passwordFocused() {
    this.isPasswordFocused = true
    this.logger.log("focus called")
  }

  passwordUnFocused() {
    this.isPasswordFocused = false
    this.logger.log("passwordUnFocused")
  }


}

