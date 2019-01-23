import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events} from 'ionic-angular';

import { HomeClassroomPage } from '../home-classroom/home-classroom';
import { SettingClassroomPage } from '../setting-classroom/setting-classroom';
import { NotificationClassroomPage } from '../notification-classroom/notification-classroom';

import { AddclassroomPage } from '../addclassroom/addclassroom';

@IonicPage()
@Component({
  selector: 'page-classroom',
  templateUrl: 'classroom.html'
})
export class ClassroomPage {

  homeClassroomRoot = HomeClassroomPage
  notificationClassroomRoot = NotificationClassroomPage
  settingClassroomRoot = SettingClassroomPage
  rootPageParams;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,   
    public events:Events
    ) {
      let classroom = this.navParams.get('classroom') ? this.navParams.get('classroom') : {};
      this.rootPageParams = classroom
    }

}
