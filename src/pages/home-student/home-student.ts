
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events,MenuController,ModalController,ToastController } from 'ionic-angular';

import { SubjectProvider } from '../../providers/subject/subject';
import { LeaveModalPage } from '../leave-modal/leave-modal';
import { MenuPage } from './../menu/menu';
import {storage} from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';


@IonicPage()
@Component({
  selector: 'page-home-student',
  templateUrl: 'home-student.html',
})
export class HomeStudentPage {

  classroom: any;
  uid:any;
  topic:any;
  fullname:any;

  subject:any;
  leave:any;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public events:Events,
    public menuCtrl:MenuController,
    public subjectService:SubjectProvider,
    public mdCtrl: ModalController,
    public toastCtrl: ToastController,
    private afd: AngularFireDatabase,
    ) {
      this.topic = "history";

      this.classroom = this.navParams.get('classroom') ? this.navParams.get('classroom') : {};
      this.uid = this.navParams.get('uid') ? this.navParams.get('uid') : {};
      this.fullname = this.navParams.get('fullname');

      this.getSuject(this.uid,this.classroom['group_code']);
      this.getLeave(this.uid,this.classroom['group_code']);

      console.log(this.subject);

      // this.subjectService.saveLeave(this.uid,this.classroom)
      // console.log(this.fullname);
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
      this.subject = res;
      // console.log(this.subject);
    });
  }


  getLeave(uid:any,group_code:any){
    this.leave = [];
    this.subjectService.getLeve(uid,group_code)
    .then(res=>{
      this.leave = res;
      console.log(this.leave);
    });
  }



  goToLeavemodal(){
    let modal = this.mdCtrl.create(LeaveModalPage);
    // this.events.publish('showLoading');
    modal.present();
    modal.onDidDismiss(data => {
        if (data) {
          // let key = this.afd.database.ref().push().key;
            this.subjectService.saveLeave(data,this.uid,this.classroom,this.fullname).then(res=>{
              this.presentToast("แจ้งลาหยุดให้เรียบร้อยแล้ว !!");
              this.getLeave(this.uid,this.classroom['group_code']);
            })
        }else{
          this.presentToast("ไม่สามารถแจ้งลาหยุดได้ กรุณาแจ้งใหม่ !!");
        }
      
    });
  }

  presentToast(_msg: any) {
    let toast = this.toastCtrl.create({
      message: _msg,
      duration: 1500,
      position: 'top'
    });

    toast.present();
  }
  toHome() {
    // this.navCtrl.setRoot(MenuPage,{},{animate: true, direction:'forward'});
    this.events.publish('showLoading');
    this.navCtrl.setRoot(MenuPage, {}, { animate: true, direction: 'back' });
  }


  removeleave(item:any){
    this.afd.database.ref(`/leaves/${item.image_name}`).remove().then((res)=>{
      storage().ref(`/leaves/${item.image_name}`).delete().then((ress)=>{
        this.presentToast("ลบประวัติการแจ้งลา สำเร็จ");
      });
    });
    this.getLeave(this.uid,this.classroom['group_code']);
  }

}
