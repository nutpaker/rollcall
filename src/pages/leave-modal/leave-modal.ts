import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events, ViewController, AlertController, } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators,AbstractControl,ValidationErrors } from "@angular/forms";

export class DateValidation{
  static MatchDate(abstractCtrl: AbstractControl){
    let startdate = Date.parse( abstractCtrl.get('startdate').value);
    let enddate = Date.parse(abstractCtrl.get('enddate').value);
    let caldate = enddate - startdate;
    // 172800000
    console.log(caldate);
    if (caldate >  172800000|| caldate < 0){
      abstractCtrl.get('enddate').setErrors({MatchDate:true});
    }
    return null;
  }
}

@IonicPage()
@Component({
  selector: 'page-leave-modal',
  templateUrl: 'leave-modal.html',
})

export class LeaveModalPage {

  leaveForm:FormGroup;

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public events: Events,
     public viewCtrl: ViewController,
     public alertCtrl: AlertController,
     public formBuilder: FormBuilder,
     
     ) {

      this.leaveForm = formBuilder.group({
        'startdate' :['',Validators.compose([Validators.required])],
        'enddate':['',Validators.compose([Validators.required])],
        'detail':['',Validators.compose([Validators.required])],
        'picture': ['',Validators.compose([Validators.required])]
      },{
        validator:DateValidation.MatchDate
      });
     }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaveModalPage');
  }

}
