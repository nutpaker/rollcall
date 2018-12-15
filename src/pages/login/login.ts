import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  AlertController,
} from 'ionic-angular';
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
    private AuthService: AuthenticationProvider,
    public formBuilder: FormBuilder,
    public events: Events,
    public alertCtrl: AlertController,
  ) {
    this.authForm = formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillEnter() {
    this.events.publish('dismissLoading');
  }

  toLogin() {
    this.events.publish('showLoading');
    this.AuthService.login(this.authForm.value)
      .then(response => {
        this.navCtrl.setRoot(HomePage);
      }, (error) => {
        let alert = this.alertCtrl.create({
          title: "Email or Password is Incorrect",
          enableBackdropDismiss: false,
          buttons: [{
            text: 'OK',
            handler: () => {
              this.events.publish('dismissLoading');
            }
          }]
        });
        alert.present();
      });
  }

  toRegister() {
    this.navCtrl.push(RegisterPage);
    this.events.publish('showLoading');
  }

}
