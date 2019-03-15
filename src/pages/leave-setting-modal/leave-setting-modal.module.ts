import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaveSettingModalPage } from './leave-setting-modal';

@NgModule({
  declarations: [
    LeaveSettingModalPage,
  ],
  imports: [
    IonicPageModule.forChild(LeaveSettingModalPage),
  ],
})
export class LeaveSettingModalPageModule {}
