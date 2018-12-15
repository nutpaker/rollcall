import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {AuthenticationProvider} from '../../providers/authentication/authentication'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,private AuthService:AuthenticationProvider) {
  }

  toLogout(){
    this.AuthService.logout();
  }

}
