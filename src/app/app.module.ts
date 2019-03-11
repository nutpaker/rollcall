import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BarcodeScanner } from '@ionic-native/barcode-scanner'
import { Toast } from '@ionic-native/toast'

// Other
// FIREBASE
import { AngularFireModule } from 'angularfire2';

// Auth with Firebase
import { AngularFireAuthModule } from 'angularfire2/auth'

// Connect Database Fire Base
import { AngularFireDatabase,AngularFireDatabaseModule} from 'angularfire2/database';

// Envelopment
import { envelopment } from '../envelopments/envelopment';

// Page
import { MyApp } from './app.component';
import { LoginPageModule } from '../pages/login/login.module';
import { RegisterPageModule } from '../pages/register/register.module';
import { HomePageModule } from '../pages/home/home.module';
import { AddclassroomPageModule } from '../pages/addclassroom/addclassroom.module';
import { HomeStudentPageModule } from '../pages/home-student/home-student.module';

// Page Modal
import { AddclassroomDateModalPageModule } from '../pages/addclassroom-date-modal/addclassroom-date-modal.module';
import { EditsubjectModalPageModule } from '../pages/editsubject-modal/editsubject-modal.module'

// Menu
import { MenuPageModule } from '../pages/menu/menu.module';

// Tabs
import { ClassroomPageModule } from '../pages/classroom/classroom.module';
import { HomeClassroomPageModule } from '../pages/home-classroom/home-classroom.module';
import { NotificationClassroomPageModule } from '../pages/notification-classroom/notification-classroom.module';
import { SettingClassroomPageModule } from '../pages/setting-classroom/setting-classroom.module';

// Provider
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { RegisterProvider } from '../providers/register/register';
import { ClassroomProvider } from '../providers/classroom/classroom';
import { TimestampProvider } from '../providers/timestamp/timestamp';
import { SubjectProvider } from '../providers/subject/subject';

@NgModule({
  declarations: [
    MyApp,
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
    RegisterPageModule,
    HomePageModule,
    AddclassroomPageModule,
    AddclassroomDateModalPageModule,
    EditsubjectModalPageModule,
    HomeStudentPageModule,
    //Menu
    MenuPageModule,
    //Tab
    ClassroomPageModule,
    HomeClassroomPageModule,
    NotificationClassroomPageModule,
    SettingClassroomPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthenticationProvider,
    AngularFireDatabase,
    RegisterProvider,
    ClassroomProvider,
    SocialSharing,
    BarcodeScanner,
    Toast,
    TimestampProvider,
    SubjectProvider,
  ]
})
export class AppModule {}
