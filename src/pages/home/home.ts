import { AddclassroomDateModalPage } from '../addclassroom-date-modal/addclassroom-date-modal';
import { AddclassroomPage } from '../addclassroom/addclassroom';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';


import { AuthenticationProvider } from '../../providers/authentication/authentication'

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  _email: any;
  _faculty: any;
  _fname: any;
  _lname: any;
  _major: any;
  _role: any;
  _student_id: any;
  _uid: any
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private AuthService: AuthenticationProvider,
    public events: Events,
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  ionViewWillEnter() {

    this.events.publish('dismissLoading');

    this.getProfile();
  }

  getProfile() {
    this.AuthService.getCurrentUser()
      .then(uid => {
        console.log(uid);
        this.AuthService.getProfile(uid)
          .then(res => {
              this._email = res['email'],
              this._faculty = res['faculty'],
              this._fname =res['fname'],
              this._lname = res['lname'],
              this._major=res['major'],
              this._role=res['role'],
              this._student_id= res['student_id'],
              this._uid=res['uid']
          })
      });
  }
  toAddClassroom(){
    this.events.publish('showLoading');
    this.navCtrl.push(AddclassroomPage,{uid:this._uid});
    // this.navCtrl.push(AddclassroomDateModalPage);
  }
}
