import { AddclassroomDateModalPage } from '../addclassroom-date-modal/addclassroom-date-modal';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, ModalController, Navbar,Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ClassroomProvider } from '../../providers/classroom/classroom'


@IonicPage()
@Component({
  selector: 'page-addclassroom',
  templateUrl: 'addclassroom.html',
})


export class AddclassroomPage {
  @ViewChild(Navbar) navBar: Navbar;

  AddClassroomForm: FormGroup;

  // classroomdate: any[] = [];
  subjectAll: any[] = [];
  subject: any[]= [];
  classroom: any;

  group_code: any;
  group_name: any;
  invite_code: any;
  owner_code: any


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public formBuilder: FormBuilder,
    public mdCtrl: ModalController,
    public alertCtrl: AlertController,
    public classroomService: ClassroomProvider,
    public platform: Platform
  ) {
    this.group_code = this.classroomService.keygroup();
    this.owner_code = this.navParams.data['uid'];
    this.classroom = this.navParams.data['classroom'] ? this.navParams.data['classroom'] : {}
    this.getSubjectAll();

    this.AddClassroomForm = this.formBuilder.group({
      'classname': ['', Validators.compose([Validators.required])]
    });

    // Back Button Android
    platform.registerBackButtonAction(()=>{
      this.subject.forEach(item => {
        this.classroomService.removeSubject(item['subject_code']);
      });
      this.navCtrl.pop();
    })


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddclassroomPage');
    // Back Button
    this.navBar.backButtonClick = (ev:UIEvent) => {
        this.subject.forEach(item => {
          this.classroomService.removeSubject(item['subject_code']);
        });
        this.navCtrl.pop();
      }
  }



  ionViewWillEnter() {
    this.events.publish('dismissLoading');
  }

  getSubject(group_code: any) {
    this.classroomService.getSubject(group_code)
      .then(res => {
        this.subject = JSON.parse(JSON.stringify(res));
      });
  }

  getSubjectAll() {
    for (let data of this.classroom) {
      this.classroomService.getSubject(data['group_code'])
        .then(res => {
          this.subjectAll.push(res ? res : {})
        });
    }
    this.classroomService.getSubject(this.group_code)
      .then(res => {
        this.subjectAll.push(res ? res : {})
      });
  }

  addDayTime(action: any) {
    this.getSubjectAll();
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

  editDayTime(action: any,item:any) {
    this.getSubjectAll();
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

  toCreateclassroom() {
    this.events.publish('showLoading');
    this.classroomService.addGroup(this.group_code, this.AddClassroomForm.controls['classname'].value, this.owner_code);
    this.navCtrl.pop();
  }

}



