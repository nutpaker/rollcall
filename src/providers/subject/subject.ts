import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../../envelopments/AppSettings';

import { AngularFireDatabase } from 'angularfire2/database';
import { storage } from 'firebase';

@Injectable()

export class SubjectProvider {

  subject: any[] = [];
  leave:any[] = []
  student:any[] = [];

  constructor(public http: HttpClient,
    private afd: AngularFireDatabase,
    ) {}

    
  getStamptime(uid,group_code){
    return new Promise(resolve=>{
      this.afd.database.ref('timestamp').orderByKey().once("value")
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


  getLeveAll(group_code){
    return new Promise(resolve=>{
      this.afd.database.ref('leaves').orderByChild('status').once("value")
      .then(snapshot=>{
        this.leave = [];
          snapshot.forEach(childsnapshot=>{
              if(group_code === childsnapshot.val()['group_code']){
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

  saveLeave(data,uid:any,group:any,fullname:any){
    return new Promise(resolve=>{
      this.timeNow().then((unix) => {
        // firebase.database.ServerValue.TIMESTAMP
        let date = (unix['timestamp'] - 25200) * 1000;
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+date);
        let key = this.afd.database.ref().push().key;
        let leave = {
          uid:uid,
          fullname:fullname,
          timestapm:(unix['timestamp'] - 25200) * 1000,
          group_code:group.group_code,
          detail:data.detail,
          date_start:data.startdate,
          date_end:data.enddate,
          image_name:key,
          status:0,    
        };
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


  getImg(img_name: any) {
    return new Promise(resolve => {
      let storageRef = storage().ref();
      var imageRef = storageRef.child(`leaves/${img_name}`);
      imageRef.getDownloadURL()
        .then((url) => { 
          resolve(url);
        });
    });
  }

  updateStatus(key:any,status:any){
    this.afd.database.ref(`/leaves/${key}`).update({status:status});
  }

  getStuedent(group_code){
    return new Promise(resolver=>{
      this.afd.database.ref(`/classrooms/`).orderByChild('fullname').once("value")
      .then(snapshot=>{
        this.student = [];
        snapshot.forEach(childsnapshot=>{
            if(childsnapshot.val()['group_code'] == group_code){
              this.student.push(childsnapshot.val());
            }
        });
        resolver(this.student);
      });

    });
  }

  updateStatusTime(status:any,item:any){
    return new Promise(resolve=>{
      this.afd.database.ref('timestamp').orderByChild('stamp').once("value")
      .then(snapshot=>{
          snapshot.forEach(childsnapshot=>{
            if(item.uid === childsnapshot.val()['uid'] && item.group_code === childsnapshot.val()['group_code'] && item.stamp === childsnapshot.val()['stamp']){
              this.afd.database.ref(`/timestamp/${childsnapshot.key}`).update({status:status});
              resolve();
            }
          }); 
      });
    })

  }

  

}
