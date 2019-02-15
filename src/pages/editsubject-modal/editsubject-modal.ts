import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController, AlertController, } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, } from "@angular/forms";
import { ClassroomProvider } from './../../providers/classroom/classroom';

@IonicPage()
@Component({
  selector: 'page-editsubject-modal',
  templateUrl: 'editsubject-modal.html',
})
export class EditsubjectModalPage {

  studyForm: FormGroup;
  subject: any[];
  data:any;
  img:any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public formBuilder: FormBuilder,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public classroom:ClassroomProvider,
  ) {


    this.subject = this.navParams.data['subject'];
    this.data = this.navParams.data['item'];
          // Get QR
   this.classroom.getQR(this.data["subject_code"])
   .then((res)=> {
     this.img = res
     console.log(res);
    }); 

    this.studyForm = this.formBuilder.group({
      'studyDay': ['', Validators.compose([Validators.required])],
      'studyTimestart': ['', Validators.compose([Validators.required])],
      'studyTimeend': ['', Validators.compose([Validators.required])],
      'studyTime_stamp_start': ['', Validators.compose([Validators.required])],
      'studyTime_late_start': ['', Validators.compose([Validators.required])],
      'studyTime_late_end': ['', Validators.compose([Validators.required])],
    });

      this.studyForm.controls['studyDay'].setValue(this.data.day);
      this.studyForm.controls['studyTimestart'].setValue(this.data.start);
      this.studyForm.controls['studyTimeend'].setValue(this.data.end);
      this.studyForm.controls['studyTime_stamp_start'].setValue(this.data.time_stamp_start);
      this.studyForm.controls['studyTime_late_start'].setValue(this.data.time_stamp_late_start);
      this.studyForm.controls['studyTime_late_end'].setValue(this.data.time_stamp_late_end);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditsubjectModalPage');
  }

  ionViewWillEnter() {
      this.events.publish('dismissLoading');
  }

  onSubmit() {
    // let chk: boolean = false;
    // let nstart = Date.parse("01/01/2019 " + this.studyForm.value['studyTimestart'] + ":00");
    // let nend = Date.parse("01/01/2019 " + this.studyForm.value['studyTimeend'] + ":00");
    // let calTime = nend - nstart;
    // if (calTime >= 3600000) {
    //   this.subject.forEach(res => {
    //     res.forEach(resp => {
    //       if (resp) {
    //         let ostart = Date.parse("01/01/2019 " + resp['start'] + ":00");
    //         let oend = Date.parse("01/01/2019 " + resp['end'] + ":00");
    //         // ตรวจสอบวันเวลา ชนกันไหม
    //         if (resp['day'] == this.studyForm.value['studyDay'] && (nstart < oend && nend > ostart)) {
    //           if (this.type == 'Edit') {
    //             if(resp['subject_code'] == this.edit['subject_code']){
    //               return chk = false
    //             }
    //             return chk = true 
    //           }
    //           return chk = true
    //         }
    //       } else {
    //         return chk = false;
    //       }
    //     });
    //   });

    //   if (!chk) {
    //     // Add subject
       
    //       let data_add = {
    //                     // subject_code: this.edit['subject_code'],
    //                     day: this.studyForm.controls['studyDay'].value,
    //                     start: this.studyForm.controls['studyTimestart'].value,
    //                     end: this.studyForm.controls['studyTimeend'].value
    //                   }
    //       this.closeModal(data_add);
    //   } else {
    //     // แจ้งเตือนเวลาชน
    //     let alert = this.alertCtrl.create({
    //       title: 'Warring',
    //       subTitle: 'เวลาทับ',
    //       buttons: ['Dismiss']
    //     });
    //     alert.present();
    //   }
    // } else {
    //   let alert = this.alertCtrl.create({
    //     title: 'Warring',
    //     subTitle: 'ไม่สามารถเพิ่มตารางเวลาเรียนได้เนื่องจากต้องมีเวลาเรียนอย่างน้อย 1 ชั่วโมง',
    //     buttons: ['Dismiss']
    //   });
    //   alert.present();
    // }
  }

  closeModal(data?) {
    let para_data = data;
    this.viewCtrl.dismiss(para_data);
  }

}
