import {Component, NgModule} from '@angular/core';
import { AuthService } from './auth/auth.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})


export class AppComponent {

  constructor(public auth: AuthService) {
    // Comment out this method call if using
    // hash-based routing
    auth.handleAuthentication();


    // Uncomment this method call if using
    // hash-based routing
    // auth.handleAuthenticationWithHash();
  }
  foods = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

}
