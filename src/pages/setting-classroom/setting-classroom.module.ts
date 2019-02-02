import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingClassroomPage } from './setting-classroom';

@NgModule({
  declarations: [
    SettingClassroomPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingClassroomPage),
  ],
})
export class SettingClassroomPageModule {}
