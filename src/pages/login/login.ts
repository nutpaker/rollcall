import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AuthenticationProvider } from '../../providers/authentication/authentication'
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register'

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  authForm: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private AuthService:AuthenticationProvider,
    public formBuilder: FormBuilder,
    ) {
    this.authForm =  formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'password':['',Validators.compose([Validators.minLength(6),Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  toLogin(){
    this.AuthService.login(this.authForm.value)
    .then(response => {
      this.navCtrl.setRoot(HomePage);
  })
    .catch(error => {
      // handle error by showing alert
      console.log("ไม่ผ่าน");
  })
  }

  toRegister(){
    this.navCtrl.push(RegisterPage);
  }

}
