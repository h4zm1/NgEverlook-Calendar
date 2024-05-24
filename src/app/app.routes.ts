import {Routes} from "@angular/router";
import {EnchantComponent} from "./enchant/enchant.component";
import {AppComponent} from "./app.component";
import {EventComponent} from "./event/event.component";
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'zgenchants', component: EnchantComponent}
];
