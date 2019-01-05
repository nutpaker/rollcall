import { AddclassroomDateModalPage } from '../addclassroom-date-modal/addclassroom-date-modal';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,Events,AlertController,  ModalController, } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators,AbstractControl,ValidationErrors } from "@angular/forms";
import { ClassroomProvider } from '../../providers/classroom/classroom'


@IonicPage()
@Component({
  selector: 'page-addclassroom',
  templateUrl: 'addclassroom.html',
})
export class AddclassroomPage {
  AddClassroomForm: FormGroup;
  uid:any;
  classroomdate:any[] = [];


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public events: Events,
    public formBuilder: FormBuilder,
    public mdCtrl: ModalController,
    public alertCtrl: AlertController,
    public classroomService: ClassroomProvider,
    ) {
    this.uid = this.navParams.data
    this.AddClassroomForm = this.formBuilder.group({
      'classname': ['', Validators.compose([Validators.required])]
    });

    // Dev Test data
    // this.classroomdate = [{
    //   day:"mon",
    //   start:"10:00",
    //   end:"11:00"
    // },
    // {
    //   day:"tue",
    //   start:"10:00",
    //   end:"11:00"
    // }]

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddclassroomPage');
  }

  ionViewWillEnter(){
    this.events.publish('dismissLoading');
  }

  addDayTime(action:any){
    if(this.classroomdate.length>=1){
      let chkDay = {
        type:action,
        day:this.classroomdate[0].day,
        start:this.classroomdate[0].start,
        end:this.classroomdate[0].end,
      }

      let modal = this.mdCtrl.create(AddclassroomDateModalPage,chkDay);
      modal.present();
      modal.onDidDismiss(data=>{
      if(data){
      this.classroomdate.push(data);
      }
      });

    }else{
      let chkDay = {
        type:action
      }

      let modal = this.mdCtrl.create(AddclassroomDateModalPage,chkDay);
      modal.present();
      modal.onDidDismiss(data=>{
      if(data){
      this.classroomdate.push(data);
      }
      });
    }
  };

  removeDayTime(item:any){
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
            let index = this.classroomdate.indexOf(item);
            if(index >-1){
              this.classroomdate.splice(index,1);
            }
          }
        }
      ]
    });
    alert.present();
  }

  editDayTime(action:any,item:any){
    let index = this.classroomdate.indexOf(item);
    let para_data;
    if(index==0 &&this.classroomdate.length == 1){
      para_data = {
        type:action,
        index:index,
        edit:{      
          day:this.classroomdate[index].day,
          start:this.classroomdate[index].start,
          end:this.classroomdate[index].end
        },
  
      };

    }else if(index ==1 && this.classroomdate.length ==2){
      para_data = {
        type:action,
        index:index,
        len:this.classroomdate.length,
        edit:{      
          day:this.classroomdate[index].day,
          start:this.classroomdate[index].start,
          end:this.classroomdate[index].end
        },
        day:this.classroomdate[index-1].day,
        start:this.classroomdate[index-1].start,
        end:this.classroomdate[index-1].end
      };

    }else if(index == 0 && this.classroomdate.length ==2){
      para_data = {
        type:action,
        index:index,
        len:this.classroomdate.length,
        edit:{      
          day:this.classroomdate[index].day,
          start:this.classroomdate[index].start,
          end:this.classroomdate[index].end
        },
        day:this.classroomdate[index+1].day,
        start:this.classroomdate[index+1].start,
        end:this.classroomdate[index+1].end
      };

    }
   

    let modal = this.mdCtrl.create(AddclassroomDateModalPage,para_data);
    modal.present();
    modal.onDidDismiss(data=>{
    if(data){
    this.classroomdate[data.index] = data.data_day;
    }
    });

  }
  toCreateclassroom(){
    this.events.publish('showLoading');
    this.classroomService.addGroup(this.AddClassroomForm.controls['classname'].value,this.classroomdate,this.uid);
    this.navCtrl.pop();
  }
  }



