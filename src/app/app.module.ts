import { LoginPage } from './../pages/login/login';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
// Other
// FIREBASE
import { AngularFireModule } from 'angularfire2';

// Auth with Firebase
import { AngularFireAuthModule } from 'angularfire2/auth'

// Connect Database Fire Base
import { AngularFireDatabase,AngularFireDatabaseModule} from 'angularfire2/database';

import { HttpClientModule } from '@angular/common/http';

// Envelopment
import { envelopment } from '../envelopments/envelopment';

// Page
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPageModule } from '../pages/login/login.module';
import { RegisterPageModule } from '../pages/register/register.module';

// Provider
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { RegisterProvider } from '../providers/register/register';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(envelopment.firebase),
    AngularFireAuthModule,
    HttpClientModule,
    AngularFireDatabaseModule,
    //Page
    LoginPageModule,
    RegisterPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthenticationProvider,
    AngularFireDatabase,
    RegisterProvider
  ]
})
export class AppModule {}
