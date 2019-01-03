import { AddclassroomDateModalPage } from '../addclassroom-date-modal/addclassroom-date-modal';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,Events,AlertController,  ModalController, } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators,AbstractControl,ValidationErrors } from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-addclassroom',
  templateUrl: 'addclassroom.html',
})
export class AddclassroomPage {
  AddClassroomForm: FormGroup;
  uid:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public events: Events,
    public formBuilder: FormBuilder,
    public mdCtrl: ModalController,
    ) {
    this.uid = this.navParams.data
    this.AddClassroomForm = this.formBuilder.group({
      'classname':[""],
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddclassroomPage');
  }

  ionViewWillEnter(){
    this.events.publish('dismissLoading');
  }

  testC(){
    this.events.publish('showLoading');
    this.navCtrl.push(AddclassroomDateModalPage);
// let modal = this.mdCtrl.create(AddclassroomDateModalPage);
// modal.present();
// modal.dismiss();
  }


}
