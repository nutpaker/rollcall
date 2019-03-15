import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoryModalPage } from './history-modal';

@NgModule({
  declarations: [
    HistoryModalPage,
  ],
  imports: [
    IonicPageModule.forChild(HistoryModalPage),
  ],
})
export class HistoryModalPageModule {}
