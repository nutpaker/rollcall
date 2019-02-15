import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { AngularFireDatabase } from 'angularfire2/database';

import QRCode from 'qrcode';
import firebase from 'firebase';

@Injectable()
export class ClassroomProvider {

  classroom: any[] = [];
  subject: any[] = [];

  generated = '';

  constructor(public http: HttpClient,
    private afd: AngularFireDatabase,
  ) {
    console.log('Hello ClassroomProvider Provider');
  }

  getQR(subject:any){
    return new Promise(resolve=>{
      let storageRef = firebase.storage().ref();
      var imageRef  = storageRef.child(`QRCode/${subject}.png`);
      imageRef.getDownloadURL()
      .then((url)=>{
        resolve(url);
      })
    })

    // imageRef.getDownloadURL()
    // .then((url)=>{
    //   var xhr = new XMLHttpRequest();
    //   xhr.responseType = 'blob'
    //   xhr.onload = function(event){
    //     var blob = xhr.response
    //   };
    //   xhr.open('GET',url)
    //   xhr.send();
    //   return url
    // }).catch(function(error) {
    //   console.log("Image Error")
    // });

  }

  createQR(subject:any) {
    const qrcode = QRCode;
    const self = this;
    qrcode.toDataURL(btoa(subject), { errorCorrectionLevel: 'H' }, function (err, url) {
      self.generated = url;
      self.uploadImg(subject);
    });
  }

  uploadImg(subject:any) {
    let storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(`QRCode/${subject}.png`);
    imageRef.putString(this.generated, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
     console.log("Upload Success")
    });
  }

  keygroup(){
    return this.afd.database.ref().push().key;
  }

  addGroup(keygroup:any,classname: any, ownergroup: any) {
    let group = {
      group_name: classname,
      group_code: keygroup,
      invite_code: this.randomInvite(8),
      owner_code: ownergroup
    }
    const groupSave = this.afd.database.ref(`/groups/${keygroup}`);
    groupSave.set(group);
  }

  addSub(subject: any, groupcode: any, owner_group: any) {
      let keysub = this.afd.database.ref().push().key;
      let sub = {
        subject_code: keysub,
        group_code: groupcode,
        owner_code: owner_group,
        day: subject.day,
        start: subject.start,
        end: subject.end,
        time_stamp_start: "",
        time_stamp_end: "",
        time_stamp_late_start: "",
        time_stamp_late_end: "",
        // imgQR: ""
      }

      const subSave = this.afd.database.ref(`/subjects/${keysub}`);
      subSave.set(sub);
      this.createQR(keysub);
  }

  updateSub(subject: any,item:any){
    let sub = {
      subject_code: item['subject_code'],
      group_code: item['group_code'],
      owner_code: item['owner_code'],
      day: subject['day'],
      start: subject['start'],
      end: subject['end'],
      time_stamp_start: "",
      time_stamp_end: "",
      time_stamp_late_start: "",
      time_stamp_late_end: ""
    }
    const subSave = this.afd.database.ref(`/subjects/${item['subject_code']}`);
    subSave.update(sub);
  }

  randomInvite(length) {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  getClassroom(role: any, uid: any) {
    return new Promise(resolve => {
    // "Student"
    if (role == 0) {
      resolve();
    }
    // "Teacher"
    else if (role == 1) {
        var query = this.afd.database.ref('groups').orderByKey();
        query.once("value")
          .then((snapshot) => {
            this.classroom = [];
            snapshot.forEach(childSnapshot => {
              if (uid == childSnapshot.val()['owner_code']) {
                this.classroom.push(childSnapshot.val());
              }
            });
            resolve(this.classroom);
          });
    }
    // "Admin"
    else {
      resolve();
    }
  });
  }

  removeClassroom(role: any, key: any) {
      // "Student"
      if (role == 0) {
      }
      // "Teacher"
      else if (role == 1) {
        const groupRemove = this.afd.database.ref(`/groups/${key}`);
        groupRemove.remove();

        var query = this.afd.database.ref('subjects').orderByKey();
        query.once("value")
        .then((snapshot)=>{
            snapshot.forEach(chilSnapshot=>{
                if(key == chilSnapshot.val()['group_code']){
                  const subRemove = this.afd.database.ref(`/subjects/${chilSnapshot.val()['subject_code']}`);
                  subRemove.remove();
                  const imgRemove = firebase.storage().ref(`QRCode/${chilSnapshot.val()['subject_code']}.png`);
                  imgRemove.delete();
                }
            });
        });


        
      }
      // "Admin"
      else {
      }
  }

  getSubject(group_code:any){
    return new Promise(resolve=>{
      this.afd.database.ref('subjects').orderByKey().once("value")
      .then((snapshot)=>{
        this.subject = [];
        snapshot.forEach(childSnapshot =>{
          if (group_code == childSnapshot.val()['group_code']){
            this.subject.push(childSnapshot.val());
          }
        });
        resolve(this.subject);
      });
    })
  }

  getSubjectbyOwner(owner_code:any){
    return new Promise(resolve=>{
      this.afd.database.ref('subjects').orderByKey().once("value")
      .then((snapshot)=>{
        this.subject = [];
        snapshot.forEach(childSnapshot =>{
          if (owner_code == childSnapshot.val()['owner_code']){
            this.subject.push(childSnapshot.val());
          }
        });
        resolve(this.subject);
      });
    })
  }

  removeSubject(sub_code:any){
    const groupRemove = this.afd.database.ref(`/subjects/${sub_code}`);
    groupRemove.remove();
    const imgRemove = firebase.storage().ref(`QRCode/${sub_code}.png`);
    imgRemove.delete();
  }

  updategroupname(group_code:any,group_name:any){
    return new Promise(resolve=>{
      let group = {
        group_name: group_name,
      }
      const groupSave = this.afd.database.ref(`/groups/${group_code}`);
      groupSave.update(group).then((res)=> resolve("success"),err=>resolve("error"));
    })
  }

}
