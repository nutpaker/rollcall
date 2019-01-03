import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,Events, } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators,AbstractControl,ValidationErrors } from "@angular/forms";

/**
 * Generated class for the AddclassroomDateModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addclassroom-date-modal',
  templateUrl: 'addclassroom-date-modal.html',
})
export class AddclassroomDateModalPage {

  studyForm:FormGroup

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public events: Events,
    public formBuilder: FormBuilder,
    ) {
this.studyForm = this.formBuilder.group({
  'studyDay':[""],
  'studyTimestart' :[""],
  'studyTimeend':[""]
});

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddclassroomDateModalPage');
  }  
  
  ionViewWillEnter(){
    this.events.publish('dismissLoading');
  }

}
