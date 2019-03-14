
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events,MenuController,ModalController, } from 'ionic-angular';

import { SubjectProvider } from '../../providers/subject/subject';
import { LeaveModalPage } from '../leave-modal/leave-modal';
import { MenuPage } from './../menu/menu';
import {storage} from 'firebase';

@IonicPage()
@Component({
  selector: 'page-home-student',
  templateUrl: 'home-student.html',
})
export class HomeStudentPage {

  classroom: any;
  uid:any;
  topic:any;

  subject:any;;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public events:Events,
    public menuCtrl:MenuController,
    public subjectService:SubjectProvider,
    public mdCtrl: ModalController,
    ) {
      this.topic = "history";

      this.classroom = this.navParams.get('classroom') ? this.navParams.get('classroom') : {};
      this.uid = this.navParams.get('uid') ? this.navParams.get('uid') : {};
      // console.log(this.classroom);
      // console.log(this.uid);

      this.getSuject(this.uid,this.classroom['group_code']);

      console.log(this.subject);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeStudentPage');
  }

  ionViewWillEnter() {
    this.events.publish('dismissLoading');
  }

  filterToggle(){
    // this.events.publish('filterTab',this.service);
    this.menuCtrl.toggle('right');
  }

  getSuject(uid:any,group_code:any){
    this.subject = [];
    this.subjectService.getStamptime(uid,group_code)
    .then(res=>{
      var data = JSON.parse(JSON.stringify(res));
      var date = Date.parse(data.day);

      // var sor
      this.subject = res;
      console.log(this.subject);
    });
  }

  goToLeavemodal(){
    let modal = this.mdCtrl.create(LeaveModalPage);
    // this.events.publish('showLoading');
    modal.present();
    modal.onDidDismiss(data => {
        if (data) {
          console.log(data);
                  const pictures = storage().ref('leaves/');
        pictures.putString(data.picture,'data_url');
        }
      
    });
  }

  toHome() {
    // this.navCtrl.setRoot(MenuPage,{},{animate: true, direction:'forward'});
    this.events.publish('showLoading');
    this.navCtrl.setRoot(MenuPage, {}, { animate: true, direction: 'back' });
  }
}
