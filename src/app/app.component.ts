import { Component } from '@angular/core';
import { Platform,LoadingController,Events,} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//
import { LoginPage} from '../pages/login/login';
import { MenuPage } from '../pages/menu/menu'

import { AngularFireAuth } from 'angularfire2/auth'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any;
  _loading: any = null;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public Auth: AngularFireAuth,
    public loadCtrl: LoadingController,
    public events: Events,
    ) {
    Auth.authState.subscribe(user => {
      if (user) {
        this.rootPage = MenuPage;
      } else {
        this.rootPage = LoginPage;
      }
    });

    this.listenToEvents();

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  listenToEvents() {
   //Show Loading
   this.events.subscribe("showLoading", () => {
    this.showLoading();
  });

  //Hide Loading
  this.events.subscribe("dismissLoading", () => {
    this.dismissLoading();
  });

  }

  showLoading(): Promise<any> {
    this._loading = this.loadCtrl.create({
      content: `<ion-spinner></ion-spinner> Please wait...`
    });
    return this._loading.present();
  }

  dismissLoading(): Promise<any> {
    if (this._loading) {
      this._loading.dismissAll();
      this._loading = null;
    }
    return null;
  }
}

