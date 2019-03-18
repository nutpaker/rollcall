import { AppSettings } from './../../envelopments/AppSettings';
import { AddclassroomPage } from '../addclassroom/addclassroom';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, PopoverController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing/'
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner'
import { Toast } from '@ionic-native/toast'

import { ClassroomProvider } from '../../providers/classroom/classroom';
import { TimestampProvider } from '../../providers/timestamp/timestamp';

import { ClassroomPage } from '../classroom/classroom';
import { HomeStudentPage } from '../home-student/home-student';


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

  classroom: any = [];

  options: BarcodeScannerOptions;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    // private AuthService: AuthenticationProvider,
    public events: Events,
    public alertCtrl: AlertController,
    public ClassroomService: ClassroomProvider,
    public TimestampService: TimestampProvider,
    public popoverCtrl: PopoverController,
    public socialSharing: SocialSharing,
    public barcodeScanner: BarcodeScanner,
    public toast: Toast
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
      this.getClassrooms(this._role, this._uid);
    });

    // Hidden Tab menu
    let elements = document.querySelectorAll(".tabbar");

    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'none';
      });
    }
  }

  getClassrooms(role: any, uid: any) {
    this.classroom = [];
    this.ClassroomService.getClassroom(role, uid)
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
              this.ClassroomService.removeClassroom(this._role, this.classroom[index]['group_code'], this._uid);
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

      if (this._role == 0) {
        this.events.publish('showLoading');
        this.navCtrl.push(HomeStudentPage, { classroom: this.classroom[index], uid: this._uid ,fullname:this._fname+"  "+this._lname})
      } else {
        this.events.publish('showLoading');
        this.navCtrl.push(ClassroomPage, { classroom: this.classroom[index] });
      }
    }
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
            this.ClassroomService.joinClassroom(data['invitecode'], this._uid, this._fname + "  " + this._lname)
              .then((res) => {
                if (res['status']) {
                  let alert = this.alertCtrl.create({
                    title: 'Use this lightsaber?',
                    message: res['message'],
                    buttons: [
                      {
                        text: 'Agree',
                        handler: () => {
                          this.getClassrooms(this._role, this._uid);
                        }
                      }
                    ]
                  });
                  alert.present();
                } else {
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

  shareClassroom(item?) {
    console.log("Share.....");
    let index = this.classroom.indexOf(item);
    if (index > -1) {
      console.log("Share if condition");
      this.socialSharing.share("สามารถเข้าร่วม Classroom ด้วยรหัส " + this.classroom[index]['invite_code'], null, null, AppSettings.API_SHARE + '?gcode=' + this.classroom[index]['group_code'])
        .then((res) => {
          console.log("Share Success");
        }, (err) => {
          console.log(err);
        })
    }
  }

  scanQR() {
    this.options = {
      prompt: "Testtttttttttt",
    };
    this.barcodeScanner.scan(this.options)
      .then(barcodeData => {
        this.TimestampService.chkSubject(atob(barcodeData.text), this._uid).then((res) => {
          // this.toast.show(JSON.stringify(res), '5000', 'bottom').subscribe();

          ///////////////// ไม่มีกลุ่มอยู่
          if (res['status']) {
            const prompt = this.alertCtrl.create({
              title: 'Login',
              message: res['message'] + " " +res['group_code'],
              buttons: [
                {
                  text: 'Cancel',
                  handler: data => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: 'Confirm',
                  handler: data => {
                    // console.log('Saved clicked');
                    this.ClassroomService.joinClassroomWithGroupcode(res['group_code'],this._uid,this._fname + "  " + this._lname)
                    .then((res)=>{
                      if(res['status']){
                        this.getClassrooms(this._role, this._uid);
                        this.toast.show(res['message'], '5000', 'bottom').subscribe();
                      }
              
                    })
                  }
                }
              ]
            });
            prompt.present();
       
              ///////////////// มีกลุ่มอยู่แล้ว 
            } else {
            const alert = this.alertCtrl.create({
              title: 'New Friend!',
              subTitle: res['message'],
              buttons: ['OK']
            });
            alert.present();
          }
        });
      }).catch(err => {
        console.log(err);
        this.toast.show("QR code ไม่ถูกต้อง!! กรุณาสแกน QR Code ใหม่", '5000', 'bottom').subscribe();
      })
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getClassrooms(this._role, this._uid);
      event.complete();
    }, 2000);
  }


}
