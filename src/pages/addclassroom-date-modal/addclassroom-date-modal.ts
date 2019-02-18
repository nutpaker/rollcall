import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController, AlertController, } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, } from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-addclassroom-date-modal',
  templateUrl: 'addclassroom-date-modal.html',
})
export class AddclassroomDateModalPage {

  studyForm: FormGroup;
  // day: any;
  // start: any;
  // end: any;
  // index: any;
  type: any;
  subject: any[];
  edit: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public formBuilder: FormBuilder,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
  ) {

    this.type = this.navParams.data['action'];
    this.subject = this.navParams.data['subject'];
    console.log(JSON.stringify(this.subject));

    this.studyForm = this.formBuilder.group({
      'studyDay': ['', Validators.compose([Validators.required])],
      'studyTimestart': ['', Validators.compose([Validators.required])],
      'studyTimeend': ['', Validators.compose([Validators.required])],
    });

    if (this.type == 'Edit') {
      this.edit = this.navParams.data['item'];
      this.studyForm.controls['studyDay'].setValue(this.edit.day);
      this.studyForm.controls['studyTimestart'].setValue(this.edit.start);
      this.studyForm.controls['studyTimeend'].setValue(this.edit.end);

    }


    // console.log(JSON.stringify(this.subject));
    // console.log(this.subject)

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddclassroomDateModalPage');
  }

  ionViewWillEnter() {
    this.events.publish('dismissLoading');
  }

  onSubmit() {
    let chk: boolean = true;
    let nstart = Date.parse("01/01/2019 " + this.studyForm.value['studyTimestart'] + ":00");
    let nend = Date.parse("01/01/2019 " + this.studyForm.value['studyTimeend'] + ":00");
    let calTime = nend - nstart;
    if (calTime >= 3600000) {
      for (let i of this.subject) {
        for (let j of i) {
          if (this.type == 'Edit' && j['subject_code'] == this.edit['subject_code']) {
            continue;
          }
            let ostart = Date.parse("01/01/2019 " + j['start'] + ":00");
            let oend = Date.parse("01/01/2019 " + j['end'] + ":00");
            if (j['day'] == this.studyForm.value['studyDay'] && (nstart < oend && nend > ostart)) {
              let alert = this.alertCtrl.create({
                title: 'Warring',
                subTitle: 'เวลาทับ',
                buttons: ['Dismiss']
              });
              alert.present();
              chk = false
              break;
            }
        }
      }
    }else{
      let alert = this.alertCtrl.create({
        title: 'Warring',
        subTitle: 'ไม่สามารถเพิ่มตารางเวลาเรียนได้เนื่องจากต้องมีเวลาเรียนอย่างน้อย 1 ชั่วโมง',
        buttons: ['Dismiss']
      });
      alert.present();
      chk = false;

    }

    if(chk) {
      // Add subject
      let data_add = {
        day: this.studyForm.controls['studyDay'].value,
        start: this.studyForm.controls['studyTimestart'].value,
        end: this.studyForm.controls['studyTimeend'].value
      }
      this.closeModal(data_add);
    }
  }

  closeModal(data?) {
    let para_data = data;
    this.viewCtrl.dismiss(para_data);
  }

}
