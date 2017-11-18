import {Component, NgModule} from '@angular/core';
import { AuthService } from './auth/auth.service';
import {UsersService} from "./profile/users.service";
import {Users} from "./profile/users.entity";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})


export class AppComponent {

  user:Users;
  user_auth0;
  constructor(public auth: AuthService,public us:UsersService) {
    // Comment out this method call if using
    // hash-based routing
    auth.handleAuthentication();
  }



}
