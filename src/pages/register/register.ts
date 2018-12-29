import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  AlertController,
} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators,AbstractControl,ValidationErrors } from "@angular/forms";

// import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { RegisterProvider } from '../../providers/register/register'


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

  FacultyOption = {
    title: 'Select Faculty',
    // subTitle: 'Select your toppings',
    // mode: 'md'
  };
  MajorOption = {
    title: 'Select Major',
    // subTitle: 'Select your toppings',
    // mode: 'md'
  };


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    // public AuthService: AuthenticationProvider,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public registerService: RegisterProvider,
  ) {
    this.regForm = formBuilder.group({
      'email' :['',Validators.compose([Validators.required,Validators.email]),[this.validateEmail.bind(this)]],
      'password': ['', Validators.compose([Validators.minLength(6), Validators.required])],
      'confirmPassword':['',Validators.compose([Validators.required])],
      'firstname':['',Validators.compose([Validators.required])],
      'lastname':['',Validators.compose([Validators.required])],
      'studentid':['',Validators.compose([Validators.required]),[this.validateStudentID.bind(this)]],
      'faculty':['',Validators.compose([Validators.required])],
      'major':['',Validators.compose([Validators.required])]
    },{
      validator: PasswordValidation.MatchPassword
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }
  ionViewWillEnter() {
    this.events.publish('dismissLoading');
  }

  validateStudentID() : ValidationErrors {
    return new Promise((resolve,reject)=>{
      setTimeout(() => {
      this.registerService.studentidCheck(this.regForm.controls['studentid'].value)
      .then(data=>{
        var chk = data;
        if(chk){
          resolve({ student: true });
        }else{
          resolve(null);
        }
      });
    }, 1000);
    });
    

  }

  validateEmail() : ValidationErrors {
    return new Promise((resolve,reject)=>{
      setTimeout(() => {
      this.registerService.emailCheck(this.regForm.controls['email'].value)
      .then(data=>{
        var chk = data;
        if(chk){
          resolve({ emailchk: true });
        }else{
          resolve(null);
        }
      });
    }, 1000);
    });
  }

  toRegister(){
    this.events.publish('showLoading');
    this.registerService.register(this.regForm.value);
    // console.log(this.regForm.value);
  }
}
