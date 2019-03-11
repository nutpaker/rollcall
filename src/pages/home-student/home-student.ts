import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events,MenuController } from 'ionic-angular';

import { SubjectProvider } from '../../providers/subject/subject';

@IonicPage()
@Component({
  selector: 'page-home-student',
  templateUrl: 'home-student.html',
})
export class HomeStudentPage {

  classroom: any;
  uid:any;
  topic:any;

  subject:any;;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public events:Events,
    public menuCtrl:MenuController,
    public subjectService:SubjectProvider
    ) {
      this.topic = "history";

      this.classroom = this.navParams.get('classroom') ? this.navParams.get('classroom') : {};
      this.uid = this.navParams.get('uid') ? this.navParams.get('uid') : {};
      // console.log(this.classroom);
      // console.log(this.uid);

      this.getSuject(this.uid,this.classroom['group_code']);

      console.log(this.subject);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeStudentPage');
  }

  ionViewWillEnter() {
    this.events.publish('dismissLoading');
  }

  filterToggle(){
    // this.events.publish('filterTab',this.service);
    this.menuCtrl.toggle('right');
  }

  getSuject(uid:any,group_code:any){
    this.subject = [];
    this.subjectService.getStamptime(uid,group_code)
    .then(res=>{
      var data = JSON.parse(JSON.stringify(res));
      var date = Date.parse(data.day);

      // var sor





      this.subject = res;
      console.log(this.subject);
    });
  }
}
