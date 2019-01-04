import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController, AlertController, } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from "@angular/forms";


@IonicPage()
@Component({
  selector: 'page-addclassroom-date-modal',
  templateUrl: 'addclassroom-date-modal.html',
})
export class AddclassroomDateModalPage {

  studyForm: FormGroup;
  day: any;
  start: any;
  end: any;
  index: any;
  type: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public formBuilder: FormBuilder,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
  ) {
    this.type = this.navParams.get('type');
    this.day = this.navParams.get('day');
    this.start = this.navParams.get('start');
    this.end = this.navParams.get('end');
 
    console.log(this.index + " " + this.day);


    this.studyForm = this.formBuilder.group({
      'studyDay': ['', Validators.compose([Validators.required])],
      'studyTimestart': ['', Validators.compose([Validators.required])],
      'studyTimeend': ['', Validators.compose([Validators.required])],
    });

    if (this.type == 'Edit') {
      this.index = this.navParams.get('index');
      let edit = this.navParams.get('edit');
      this.studyForm.controls['studyDay'].setValue(edit.day);
      this.studyForm.controls['studyTimestart'].setValue(edit.start);
      this.studyForm.controls['studyTimeend'].setValue(edit.end);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddclassroomDateModalPage');
  }

  ionViewWillEnter() {
    this.events.publish('dismissLoading');
  }

  onSubmit() {
    let nstart = Date.parse("01/01/2019 " + this.studyForm.controls['studyTimestart'].value + ":00");
    let nend = Date.parse("01/01/2019 " + this.studyForm.controls['studyTimeend'].value + ":00");
    let ostart = Date.parse("01/01/2019 " + this.start + ":00");
    let oend = Date.parse("01/01/2019 " + this.end + ":00");
    let calTime = nend - nstart;
    if (calTime >= 3600000) {
      if (this.studyForm.controls['studyDay'].value == this.day) {
        if (nstart < oend && nend > ostart) {
          let alert = this.alertCtrl.create({
            title: 'Warring',
            subTitle: 'เวลาทับ',
            buttons: ['Dismiss']
          });
          alert.present();
        } else {
          if (this.type == "Edit") {
            let data_add = {
              index: this.index,
              data_day: {
                day: this.studyForm.controls['studyDay'].value,
                start: this.studyForm.controls['studyTimestart'].value,
                end: this.studyForm.controls['studyTimeend'].value
              }
            }
            this.closeModal(data_add);
          } else {
            let data_add = {
              day: this.studyForm.controls['studyDay'].value,
              start: this.studyForm.controls['studyTimestart'].value,
              end: this.studyForm.controls['studyTimeend'].value
            }
            this.closeModal(data_add);
          }
        }
      } else {
        if (this.type == "Edit") {
          let data_add = {
            index: this.index,
            data_day: {
              day: this.studyForm.controls['studyDay'].value,
              start: this.studyForm.controls['studyTimestart'].value,
              end: this.studyForm.controls['studyTimeend'].value
            }
          }
          this.closeModal(data_add);
        } else {
          let data_add = {
            day: this.studyForm.controls['studyDay'].value,
            start: this.studyForm.controls['studyTimestart'].value,
            end: this.studyForm.controls['studyTimeend'].value
          }
          this.closeModal(data_add);
        }
      }
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'Warring',
        subTitle: 'ไม่สามารถเพิ่มตารางเวลาเรียนได้เนื่องจากต้องมีเวลาเรียนอย่างน้อย 1 ชั่วโมง',
        buttons: ['Dismiss']
      });
      alert.present();
    }
  }



  // if (this.index > -1) {
  //   let data_add = {
  //     index: this.index,
  //     data_day:{
  //       day: this.studyForm.controls['studyDay'].value,
  //       start: this.studyForm.controls['studyTimestart'].value,
  //       end: this.studyForm.controls['studyTimeend'].value
  //     }
  //   }
  //   this.closeModal(data_add);

  // }



  closeModal(data?) {
    let para_data = data;
    this.viewCtrl.dismiss(para_data);
  }

}
