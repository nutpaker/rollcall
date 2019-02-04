import { MenuPage } from './../menu/menu';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events ,ModalController,AlertController} from 'ionic-angular';
import { AddclassroomDateModalPage } from '../addclassroom-date-modal/addclassroom-date-modal';

import { ClassroomProvider } from '../../providers/classroom/classroom';


@IonicPage()
@Component({
  selector: 'page-setting-classroom',
  templateUrl: 'setting-classroom.html',
})
export class SettingClassroomPage {

  group_code: any;
  group_name: any;
  group_name_change:any
  invite_code: any;
  owner_code: any
  subject:any[] = [];
  subjectAll:any[]= [] ;
  classroom: any;
  
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public events:Events,
     public classroomService:ClassroomProvider,
     public mdCtrl: ModalController,
     public alertCtrl:AlertController,
     ) {
      this.group_code = this.navParams.get('group_code');
      this.group_name = this.navParams.get('group_name');
      this.invite_code = this.navParams.get('invite_code');
      this.owner_code = this.navParams.get('owner_code');
      this.group_name_change = this.navParams.get('group_name');
      this.classroom = this.navParams.data['classroom'] ? this.navParams.data['classroom'] : {}
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
        this.subject = JSON.parse(JSON.stringify(res));
      });
  }

  addDayTime(action:any){
    this.getSubjectAll(this.owner_code);
    let modal = this.mdCtrl.create(AddclassroomDateModalPage, { action: action, subject: this.subjectAll });
    modal.present();
    modal.onDidDismiss(data => {
      if(action=="Add"){
        if (data) {
          this.classroomService.addSub(data, this.group_code, this.owner_code);
          this.getSubject(this.group_code);
        }
      }
    });
  }

  getSubjectAll(owner_code:any) {
    this.subjectAll = [];
    this.classroomService.getSubjectbyOwner(owner_code)
    .then(res=>{
      this.subjectAll.push(res ? res : {});
    })
  }
  
  changeGroupname(){
    const confirm = this.alertCtrl.create({
      title: 'Use this lightsaber?',
      message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.classroomService.updategroupname(this.group_code,this.group_name_change)
    .then(res=>{
      console.log(res); 
      this.toHome();
    });
          }
        }
      ]
    });
    confirm.present();
  }

  removeDayTime(item: any) {
    let alert = this.alertCtrl.create({
      title: 'Use this lightsaber?',
      message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.classroomService.removeSubject(item['subject_code']);
            this.getSubject(this.group_code);
          }
        }
      ]
    });
    alert.present();
  }

  // getSubjectAll2() {
  //   this.subjectAll = [];
  //   for (let data of this.classroom) {
  //     this.classroomService.getSubject(data['group_code'])
  //       .then(res => {
  //         this.subjectAll.push(res ? res : {})
  //       });
  //   }
  //   this.classroomService.getSubject(this.group_code)
  //     .then(res => {
  //       this.subjectAll.push(res ? res : {})
  //     });
  // }

  editDayTime(action: any,item:any) {
    this.getSubjectAll(this.owner_code);
    let modal = this.mdCtrl.create(AddclassroomDateModalPage, { action: action, subject: this.subjectAll,item:item });
    modal.present();
    modal.onDidDismiss(data => {
      if(action=="Edit"){
        if (data) {
          this.classroomService.updateSub(data,item);
          this.getSubject(this.group_code);
        }
      }
      
    });
  }
}
