import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationClassroomPage } from './notification-classroom';

@NgModule({
  declarations: [
    NotificationClassroomPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationClassroomPage),
  ],
})
export class NotificationClassroomPageModule {}
