import { MenuPage } from './../menu/menu';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';

import { ClassroomProvider } from '../../providers/classroom/classroom';


@IonicPage()
@Component({
  selector: 'page-setting-classroom',
  templateUrl: 'setting-classroom.html',
})
export class SettingClassroomPage {

  group_code: any;
  group_name: any;
  invite_code: any;
  owner_code: any
  subject = [];
  
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public events:Events,
     public classroomService:ClassroomProvider
     ) {
      this.group_code = this.navParams.get('group_code');
      this.group_name = this.navParams.get('group_name');
      this.invite_code = this.navParams.get('invite_code');
      this.owner_code = this.navParams.get('owner_code');

      this.getSubject(this.group_code);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingClassroomPage');
  }

  ionViewWillEnter() {
    this.events.publish('dismissLoading');
  }

  toHome(){
    // this.navCtrl.setRoot(MenuPage,{},{animate: true, direction:'forward'});
    this.events.publish('showLoading');
    this.navCtrl.setRoot(MenuPage,{},{animate: true, direction:'back'});
  }

    getSubject(group_code: any) {
    this.classroomService.getSubject(group_code)
      .then(res => {
        // console.log(res);

        this.subject = JSON.parse(JSON.stringify(res));
        console.log(this.subject);
      });
  }

}
