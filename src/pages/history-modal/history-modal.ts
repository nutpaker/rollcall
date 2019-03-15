import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,AlertController,ToastController } from 'ionic-angular';
import { SubjectProvider } from '../../providers/subject/subject';

@IonicPage()
@Component({
  selector: 'page-history-modal',
  templateUrl: 'history-modal.html',
})
export class HistoryModalPage {

  items:any
  timestamp:any;
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public viewCtrl: ViewController,
     public subjectService:SubjectProvider,
     public alertCtrl: AlertController,
     public toastCtrl:ToastController
     ) {
      this.items = this.navParams.get('item');

      this.getTimestampHistory(this.items['uid'],this.items['group_code']);
  }

  ionViewDidLoad() {
    this.getTimestampHistory(this.items['uid'],this.items['group_code']);
  }


  getTimestampHistory(uid:any,group_code:any){
    this.timestamp= [];
    this.subjectService.getStamptime(uid,group_code).then((res)=>{
      this.timestamp = res;
      console.log(res);
    });
  }

  updateStatus(item){
    console.log(item);
    let chk1 = false;
    let chk2 = false;
    let chk3 = false;
    let chk4 = false;
    // 0 มา, 1 สาย, 2 ขาด , 3 ลา

    if(item.status == 0){
      chk1 = true;
    }else if(item.status ==1){
      chk2 = true;
    }else if(item.status ==2){
      chk3 = true;
    }else{
      chk4 = true;
    }

    let alert = this.alertCtrl.create();
    alert.setTitle('Select Status');
    alert.addInput({
      type: 'radio',
      label: 'มาทันเข้าเรียนปกติ',
      value: '0',
      checked: chk1
    });
    alert.addInput({
      type: 'radio',
      label: 'สาย',
      value: '1',
      checked: chk2
    });
    alert.addInput({
      type: 'radio',
      label: 'ขาด',
      value: '2',
      checked: chk3
    });
    alert.addInput({
      type: 'radio',
      label: 'ลา',
      value: '3',
      checked: chk4
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Update',
      handler: data => {
        this.subjectService.updateStatusTime(data,item).then((res)=>{
          let toast = this.toastCtrl.create({
            message: "แก้ไข Status เรียบร้อย !!",
            duration: 1500,
            position: 'top'
          });
      
          toast.present();

          this.viewCtrl.dismiss();
        })

      }
    });
    alert.present();

  }

  doRefresh(event) {
    setTimeout(() => {
      this.getTimestampHistory(this.items['uid'],this.items['group_code']);
      event.complete();
    }, 2000);
  }

}
