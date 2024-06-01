import {Routes} from "@angular/router";
import {EnchantComponent} from "./enchant/enchant.component";
import {HomeComponent} from "./home/home.component";
import { LoginComponent } from "./login/login.component";

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'zgenchants', component: EnchantComponent},
  {path: 'login', component: LoginComponent}
];
