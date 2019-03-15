import { MenuPage } from './../menu/menu';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { SubjectProvider } from '../../providers/subject/subject'

@IonicPage()
@Component({
  selector: 'page-notification-classroom',
  templateUrl: 'notification-classroom.html',
})
export class NotificationClassroomPage {

  group_code: any;
  group_name: any;
  invite_code: any;
  owner_code: any
  leave:any;
  
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public events:Events,
     public subjectService:SubjectProvider,
     ) {
      this.group_code = this.navParams.get('group_code');
      this.group_name = this.navParams.get('group_name');
      this.invite_code = this.navParams.get('invite_code');
      this.owner_code = this.navParams.get('owner_code');

      this.getLeve();
      console.log(this.leave);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationClassroomPage');
  }

  ionViewWillEnter() {
    this.events.publish('dismissLoading');
  }

  toHome(){
    // this.navCtrl.setRoot(MenuPage,{},{animate: true, direction:'forward'});
    this.events.publish('showLoading');
    this.navCtrl.setRoot(MenuPage,{},{animate: true, direction:'back'});
  }


  getLeve(){
    this.leave = [];
    this.subjectService.getLeveAll(this.group_code).then(res=>{

      this.leave = res;
      console.log(res);
    });
  }

}
