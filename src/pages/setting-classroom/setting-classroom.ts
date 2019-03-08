import { MenuPage } from './../menu/menu';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events ,ModalController,AlertController} from 'ionic-angular';
import { AddclassroomDateModalPage } from '../addclassroom-date-modal/addclassroom-date-modal';
import { EditsubjectModalPage } from '../editsubject-modal/editsubject-modal';

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
 
    // รับค่า Subject ของ Class Room นี้
  getSubject(group_code: any) {
    this.classroomService.getSubject(group_code)
      .then(res => {
        var data = JSON.parse(JSON.stringify(res));

        var sorter = {
          // "sunday": 0, // << if sunday is first day of week
          "mon": 1,
          "tue": 2,
          "wed": 3,
          "thu": 4,
          "fri": 5,
          "sat": 6,
          "sun": 7
        }

        var sortByProperty = function (property) {
          return function (x, y) {
            return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
          };
        };

        data.sort(function (a, b) {
          return sorter[a.day] - sorter[b.day];
        });

        this.subject = JSON.parse(JSON.stringify(data, null, 0))
        // console.log(JSON.stringify(this.subject));
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

  // รับค่า Subject ที่เป็าเจ้าของ ของทุก Classroom
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

  editDayTime(item:any) {
    this.events.publish('showLoading');
    this.getSubjectAll(this.owner_code);
    let modal = this.mdCtrl.create(EditsubjectModalPage, {subject: this.subjectAll,item:item});
    modal.present();
    modal.onDidDismiss(data => {
        if (data) {
          this.classroomService.updateSub(data,item,1);
          this.getSubject(this.group_code);
        }
    });
  }
}
