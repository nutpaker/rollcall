import { AddclassroomPage } from '../addclassroom/addclassroom';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, PopoverController } from 'ionic-angular';

import { ClassroomProvider } from '../../providers/classroom/classroom';

import { ClassroomPage } from '../classroom/classroom';

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

  classroom: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    // private AuthService: AuthenticationProvider,
    public events: Events,
    public alertCtrl: AlertController,
    public ClassroomService: ClassroomProvider,
    public popoverCtrl: PopoverController
  ) {
    this.events.subscribe('profile', (res) => {
      this._email = res['email']
      this._faculty = res['faculty']
      this._fname = res['fname']
      this._lname = res['lname']
      this._major = res['major']
      this._role = res['role']
      this._student_id = res['student_id']
      this._uid = res['uid']

      // this.ClassroomService.getClassroom(this._role, this._uid)
      //   .then((resp) => {
      //     this.classroom = resp;
      //   });

      this.getClassrooms(this._role,this._uid);
    })

    // Hidden Tab menu
    let elements = document.querySelectorAll(".tabbar");

    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'none';
      });
    }
  }

  getClassrooms(role:any,uid:any){
    this.ClassroomService.getClassroom(role,uid)
    .then((resp) => {
      this.classroom = resp;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  ionViewWillEnter() {
    this.ClassroomService.getClassroom(this._role, this._uid)
      .then((resp) => {
        this.classroom = resp;
      });
    this.events.publish('dismissLoading');
  }

  toAddClassroom() {
    this.events.publish('showLoading');
    this.navCtrl.push(AddclassroomPage, { uid: this._uid, classroom: this.classroom });
    // this.navCtrl.push(AddclassroomDateModalPage);
  }

  removeClassroom(item?) {
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
            let index = this.classroom.indexOf(item);
            if (index > -1) {
              this.ClassroomService.removeClassroom(this._role, this.classroom[index]['group_code'],this._uid);
              this.classroom.splice(index, 1);
            }
          }
        }
      ]
    });
    alert.present();
  }

  toClassroom(item?) {
    let index = this.classroom.indexOf(item);
    if (index > -1) {
      // this.ClassroomService.removeClassroom(this._role,this.classroom[index]['group_code']);
      //   this.classroom.splice(index,1); 
      // this.events.publish('classroom',this.classroom[index]);
      this.events.publish('showLoading');
      this.navCtrl.push(ClassroomPage, { classroom: this.classroom[index] });
    }

    // this.events.publish('');

  }

  joinClassroom() {
    const prompt = this.alertCtrl.create({
      title: 'Join to Classroom',
      message: "Enter Invite code to join classroom",
      inputs: [
        {
          name: 'invitecode',
          placeholder: 'Enter Invite Code.'
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Join',
          handler: data => {
              this.ClassroomService.joinClassroom(data['invitecode'],this._uid,this._fname + "  " +this._lname)
              .then((res)=>{

                if(res['status']){
                  let alert = this.alertCtrl.create({
                    title: 'Use this lightsaber?',
                    message: res['message'],
                    buttons: [
                      {
                        text: 'Agree',
                        handler: () => {
                          // this.ClassroomService.getClassroom(this._role, this._uid)
                          // .then((resp) => {
                          //   this.classroom = resp;
                          //   console.log(JSON.stringify(resp));
                          // });
                          this.getClassrooms(this._role,this._uid);
                        }
                      }
                    ]
                  });
                  alert.present();
                }else{
                  let alert = this.alertCtrl.create({
                    title: 'Use this lightsaber?',
                    message: res['message'],
                    buttons: [
                      {
                        text: 'Agree',
                      }
                    ]
                  });
                  alert.present();
                }
              });
          }
        }
      ]
    });
    prompt.present();
  }


}
