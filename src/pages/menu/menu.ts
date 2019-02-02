import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';

import { HomePage } from '../home/home';
import { AuthenticationProvider } from '../../providers/authentication/authentication'

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

    rootPage:any = HomePage;
    // userdata:any
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
    this.getProfile();
  }

  ionViewDidLoad() {

  }

  toLogout() {
    this.events.publish('showLoading');
    this.AuthService.logout();
  }

  getProfile(){
    this.AuthService.getProfile()
    .then(res=>{
      this._email = res['email'];
      this._faculty = res['faculty'];
      this._fname =res['fname'];
      this._lname = res['lname'];
      this._major=res['major'];
      this._role=res['role'];
      this._student_id= res['student_id'];
      this._uid=res['uid'];

      let userdata = {
        email:res['email'],
        faculty:res['faculty'],
        fname:res['fname'],
        lname:res['lname'],
        major:res['major'],
        role:res['role'],
        student_id:res['student_id'],
        uid:res['uid']
      };
       console.log(userdata);
      // this.navCtrl.setRoot(HomePage,this.userdata);
      this.events.publish('profile',userdata);
    });
  }
}
