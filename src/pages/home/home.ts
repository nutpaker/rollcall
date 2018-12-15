import { Component } from '@angular/core';
import { NavController,Events } from 'ionic-angular';

import {AuthenticationProvider} from '../../providers/authentication/authentication'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private AuthService:AuthenticationProvider,
    public events:Events
    ) {
  }
  
  ionViewWillEnter(){
    this.events.publish('dismissLoading');
  }
  toLogout(){
    this.AuthService.logout();
  }

}
