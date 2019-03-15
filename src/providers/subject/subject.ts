import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../../envelopments/AppSettings';

import { AngularFireDatabase } from 'angularfire2/database';
import { storage } from 'firebase';

@Injectable()
export class SubjectProvider {

  subject: any[] = [];
  leave:any[] = []
  constructor(public http: HttpClient,
    private afd: AngularFireDatabase,
    ) {}

  getStamptime(uid,group_code){
    return new Promise(resolve=>{
      this.afd.database.ref('timestamp').orderByChild('stamp').once("value")
      .then(snapshot=>{
        this.subject = [];
          snapshot.forEach(childsnapshot=>{
            if(uid === childsnapshot.val()['uid'] && group_code === childsnapshot.val()['group_code']){
              this.subject.push(childsnapshot.val()); 
            }
          });
          resolve(this.subject);
      });
    })
  }


  getLeve(uid,group_code){
    return new Promise(resolve=>{
      this.afd.database.ref('leaves').orderByChild('timestapm').once("value")
      .then(snapshot=>{
        this.leave = [];
          snapshot.forEach(childsnapshot=>{
            if(uid === childsnapshot.val()['uid'] && group_code === childsnapshot.val()['group_code']){
              this.leave.push(childsnapshot.val()); 
            }
          });
          resolve(this.leave);
      });
    })
  }

  public timeNow() {
    return new Promise(resolve => {
      this.http.get(AppSettings.API_ENDPOINT + "time").subscribe(res => {
        resolve(res);
      });
    });
  }

  saveLeave(data,uid:any,group){
    return new Promise(resolve=>{
      this.timeNow().then((unix) => {
        // firebase.database.ServerValue.TIMESTAMP
        let date = new Date((unix['timestamp'] - 25200) * 1000);
        let key = this.afd.database.ref().push().key;
        let leave = {
          uid:uid,
          group_code:group.group_code,
          detail:data.detail,
          date_start:data.startdate,
          date_end:data.enddate,
          image_name:key,
          // 0 ผ่าน, 1 ไม่ผ่าน, 2 กำลังตรวจสอบ
          status:2,
          timestapm:date
        }
        const Leave = this.afd.database.ref(`/leaves/${key}`);
        Leave.set(leave).then(()=>{
          this.savePictureLeave(data.picture,key)
          resolve();
        })
      });
    });
  }

  savePictureLeave(img_source:any,key:any){
        const pictures = storage().ref(`/leaves/${key}`);
        pictures.putString(img_source,'data_url').then((res)=>{
          console.log("Save Image Success");
        },(err)=>{
          console.log("Error Save Image");
        })
  }
  

}
