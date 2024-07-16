import {Routes} from "@angular/router";
import {EnchantComponent} from "../enchant/enchant.component";
import {HomeComponent} from "../home/home.component";
import { LoginComponent } from "../login/login.component";
import {ConfigComponent} from "../config/config.component";
import {authGuard} from "./auth.guard";

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'zgenchants', component: EnchantComponent},
  {path: 'config', component: ConfigComponent, canActivate: [authGuard]},
  {path: 'login', component: LoginComponent}
];
