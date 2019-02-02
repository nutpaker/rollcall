import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeClassroomPage } from './home-classroom';

@NgModule({
  declarations: [
    HomeClassroomPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeClassroomPage),
  ],
})
export class HomeClassroomPageModule {}
