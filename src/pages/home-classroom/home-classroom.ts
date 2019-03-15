import { HistoryModalPage } from './../history-modal/history-modal';
import { MenuPage } from './../menu/menu';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events,ModalController,ToastController } from 'ionic-angular';
import { SubjectProvider } from '../../providers/subject/subject';



@IonicPage()
@Component({
  selector: 'page-home-classroom',
  templateUrl: 'home-classroom.html',
})
export class HomeClassroomPage {

  group_code: any;
  group_name: any;
  invite_code: any;
  owner_code: any

  student:any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public subjectService:SubjectProvider,
    public mdCtrl: ModalController,
    public toastCtrl: ToastController,
  ) {  


    this.group_code = this.navParams.get('group_code');
    this.group_name = this.navParams.get('group_name');
    this.invite_code = this.navParams.get('invite_code');
    this.owner_code = this.navParams.get('owner_code');

    this.getStudent(this.group_code);
  }

  ionViewDidLoad() {


  }

  ionViewWillEnter() {
    this.events.publish('dismissLoading');
  }

  toHome() {
    // this.navCtrl.setRoot(MenuPage,{},{animate: true, direction:'forward'});
    this.events.publish('showLoading');
    this.navCtrl.setRoot(MenuPage, {}, { animate: true, direction: 'back' });
  }

  getStudent(group_code:any){
    this.student = [];
      this.subjectService.getStuedent(group_code).then(res=>{
        console.log(res);
          this.student = res;
      });
  }


  gotoHistory(item:any){
    let modal = this.mdCtrl.create(HistoryModalPage,{item:item});
    modal.present();
  }


  doRefresh(event) {
    setTimeout(() => {
      this.getStudent(this.group_code);
      event.complete();
    }, 2000);
  }

}
