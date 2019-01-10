import { MenuPage } from './../menu/menu';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-home-classroom',
  templateUrl: 'home-classroom.html',
})
export class HomeClassroomPage {

  group_code: any;
  group_name: any;
  invite_code: any;
  owner_code: any

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events
  ) {  
    this.group_code = this.navParams.get('group_code');
    this.group_name = this.navParams.get('group_name');
    this.invite_code = this.navParams.get('invite_code');
    this.owner_code = this.navParams.get('owner_code');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeClassroomPage');
  }

  ionViewWillEnter() {
    this.events.publish('dismissLoading');
  }

  toHome() {
    // this.navCtrl.setRoot(MenuPage,{},{animate: true, direction:'forward'});
    this.events.publish('showLoading');
    this.navCtrl.setRoot(MenuPage, {}, { animate: true, direction: 'back' });
  }


}
