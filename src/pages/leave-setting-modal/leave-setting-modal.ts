import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController, AlertController, ToastController,} from 'ionic-angular';
import { FormBuilder, FormGroup } from "@angular/forms";
import { SubjectProvider } from '../../providers/subject/subject';
import { PhotoViewer } from '@ionic-native/photo-viewer';

@IonicPage()
@Component({
  selector: 'page-leave-setting-modal',
  templateUrl: 'leave-setting-modal.html',
})
export class LeaveSettingModalPage {

  leave:any;
  leaveForm:FormGroup;
  img_source:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public toastCtrl: ToastController,
    public subjectService:SubjectProvider,
    private photoViewer: PhotoViewer
    ) {

      this.leave = this.navParams.get('item');
      console.log(this.leave);
      let date = new Date(this.leave.timestapm);
      // let dateFormat = date.getDate() + " "+date.getMonth()+1 + " " +date.getFullYear();
      var hours = date.getHours();
      var minutes = "0" + date.getMinutes();
      var seconds = "0" + date.getSeconds();
      var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
      var month = '' + (date.getMonth() + 1);
      var daly = '' + date.getDate();
      var year = date.getFullYear();
      var formattedDate = daly + "-" + month + "-" + year;
      
      
      
      this.subjectService.getImg(this.leave.image_name).then(res=>{
        this.img_source = res;
      });
      this.leaveForm = formBuilder.group({
        'fullname':[this.leave.fullname],
        'startdate':[this.leave.date_start],
        'enddate':[this.leave.date_end],
        'detail':[this.leave.detail],
        'time':[formattedDate + " " + formattedTime],
        'status':[this.leave.status]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaveSettingModalPage');
  }


  onSubmit(){
    this.viewCtrl.dismiss(this.leaveForm.value);
  }

  showPhoto(){
    this.photoViewer.show(this.img_source);
  }

}
