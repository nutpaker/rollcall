import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
@Injectable()
export class SubjectProvider {

  subject: any[] = [];
  constructor(public http: HttpClient,
    private afd: AngularFireDatabase,
    ) {}

  getStamptime(uid,group_code){
    return new Promise(resolve=>{
      console.log(uid + "        " + group_code);
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
  

}
