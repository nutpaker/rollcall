import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home-student',
  templateUrl: 'home-student.html',
})
export class HomeStudentPage {

  classroom: any;
  uid:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public events:Events,
    ) {

      this.classroom = this.navParams.get('classroom') ? this.navParams.get('classroom') : {};
      this.uid = this.navParams.get('uid') ? this.navParams.get('uid') : {};
      console.log(this.classroom);
      console.log(this.uid);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeStudentPage');
  }

  ionViewWillEnter() {
    this.events.publish('dismissLoading');
  }
}
