import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  AlertController,
} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators,AbstractControl } from "@angular/forms";

import { AuthenticationProvider } from '../../providers/authentication/authentication';



export class StudentIDValidation {
  static MatchStudent(abstractCtrl: AbstractControl,auth:AuthenticationProvider) {
    let studentid = abstractCtrl.get('studentid').value; // to get value in input tag
    let status = auth.studentidChk(studentid);
    if(status){
      abstractCtrl.get('studentid').setErrors( {MatchStudent: true} )
    }else{
      return null
    } 
  }
}

export class PasswordValidation {
  static MatchPassword(abstractCtrl: AbstractControl) {
    let password = abstractCtrl.get('password').value; // to get value in input tag
    let confirmPassword = abstractCtrl.get('confirmPassword').value; // to get value in input tag
    if(password != confirmPassword) {
      abstractCtrl.get('confirmPassword').setErrors( {MatchPassword: true} )
    } else {
      return null
    }
  }
}


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})

export class RegisterPage {

  regForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public AuthService: AuthenticationProvider,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
  ) {
    this.regForm = formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.compose([Validators.minLength(6), Validators.required])],
      'confirmPassword':['',Validators.compose([Validators.required])],
      'firstname':['',Validators.compose([Validators.required])],
      'lastname':['',Validators.compose([Validators.required])],
      'studentid': ['', Validators.compose([Validators.required,Validators.minLength(10)])],
      'faculty':['',Validators.compose([Validators.required])],
      'major':['',Validators.compose([Validators.required])]
    },{
      // validator: PasswordValidation.MatchPassword,
      validator: StudentIDValidation.MatchStudent 
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }
  ionViewWillEnter() {
    this.events.publish('dismissLoading');
  }

}
