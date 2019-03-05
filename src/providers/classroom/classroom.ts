import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';

import { AppSettings } from '../../envelopments/AppSettings';

import QRCode from 'qrcode';
import firebase from 'firebase';

@Injectable()
export class ClassroomProvider {

  // classroom: any[] = [];
  subject: any[] = [];

  generated = '';

  constructor(public http: HttpClient,
    private afd: AngularFireDatabase,
  ) {
    console.log('Hello ClassroomProvider Provider');
  }

  getQR(subject: any) {
    return new Promise(resolve => {
      let storageRef = firebase.storage().ref();
      var imageRef = storageRef.child(`QRCode/${subject}.png`);
      imageRef.getDownloadURL()
        .then((url) => {
          resolve(url);
        });
    });
  }

  createQR(subject: any) {
    const qrcode = QRCode;
    const self = this;
    qrcode.toDataURL(btoa(subject), { errorCorrectionLevel: 'H' }, function (err, url) {
      self.generated = url;
      self.uploadImg(subject);
    });
  }

  uploadImg(subject: any) {
    let storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(`QRCode/${subject}.png`);
    imageRef.putString(this.generated, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
      console.log("Upload Success")
    });
  }

  keygroup() {
    return this.afd.database.ref().push().key;
  }

  addGroup(keygroup: any, classname: any, ownergroup: any) {
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
    let time = this.calculateTime(subject.start);

    let sub = {
      subject_code: keysub,
      group_code: groupcode,
      owner_code: owner_group,
      day: subject.day,
      start: subject.start,
      end: subject.end,
      time_stamp_start: time["time_stamp_start"],
      time_stamp_late_start: time["time_stamp_late_start"],
      time_stamp_late_end: time["time_stamp_late_end"],
    }

    const subSave = this.afd.database.ref(`/subjects/${keysub}`);
    subSave.set(sub);
    this.createQR(keysub);
  }

  updateSub(subject: any, item: any, action: any) {
    if (action == 0) {
      let time = this.calculateTime(subject['start']);
      let sub = {
        subject_code: item['subject_code'],
        group_code: item['group_code'],
        owner_code: item['owner_code'],
        day: subject['day'],
        start: subject['start'],
        end: subject['end'],
        time_stamp_start: time["time_stamp_start"],
        time_stamp_late_start: time["time_stamp_late_start"],
        time_stamp_late_end: time["time_stamp_late_end"],
      }
      const subSave = this.afd.database.ref(`/subjects/${item['subject_code']}`);
      subSave.update(sub);
    } else {
      let sub = {
        subject_code: item['subject_code'],
        group_code: item['group_code'],
        owner_code: item['owner_code'],
        day: subject['day'],
        start: subject['start'],
        end: subject['end'],
        time_stamp_start: subject["time_stamp_start"],
        time_stamp_late_start: subject["time_stamp_late_start"],
        time_stamp_late_end: subject["time_stamp_late_end"],
      }
      const subSave = this.afd.database.ref(`/subjects/${item['subject_code']}`);
      subSave.update(sub);
    }

  }

  randomInvite(length) {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  getClassroom(role: any, uid: any) {
    // this.classroom = [];
    let classroom:any[] = [];
    return new Promise(resolve => {
      
      // "Student"
      if (role == 0) {
        let myclassroom = [];
        this.afd.database.ref('classrooms').orderByKey().once("value")
        .then((snapshot)=>{
            if(snapshot.val()){
              snapshot.forEach((childSnapshot)=>{
                  if(uid == childSnapshot.val()['uid']){
                    myclassroom.push(childSnapshot.val());
                  }
              });
              this.afd.database.ref('groups').orderByKey().once("value")
              .then((snapshott)=>{
                if(snapshott.val()){
                  for(let i of myclassroom){
                    snapshott.forEach((childsnapshott)=>{
                      if(childsnapshott.val()['group_code'] == i['group_code']){
                        classroom.push(childsnapshott.val());
                      }
                    });
                  }
                  resolve(classroom);
                }
              });
            }
        });
      }
      // "Teacher"
      else if (role == 1) {
        var query = this.afd.database.ref('groups').orderByKey();
        query.once("value")
          .then((snapshot) => {
            snapshot.forEach(childSnapshot => {
              if (uid == childSnapshot.val()['owner_code']) {
                classroom.push(childSnapshot.val());
              }
            });
            resolve(classroom);
          });
      }
      // "Admin"
      else {
        resolve();
      }
    });
  }

  removeClassroom(role: any, key: any,uid:any) {
    // "Student"
    if (role == 0) {
      this.afd.database.ref('classrooms').orderByKey().once("value")
      .then((snapshot) => {
          snapshot.forEach((childSnapshot) => {
              if (key == childSnapshot.val()['group_code'] && uid == childSnapshot.val()['uid']) {
                const groupRemove = this.afd.database.ref(`/classrooms/${childSnapshot.key}`);
                groupRemove.remove();
              }
          });
      });
    }
    // "Teacher"
    else if (role == 1) {
      const groupRemove = this.afd.database.ref(`/groups/${key}`);
      groupRemove.remove();

      var query = this.afd.database.ref('subjects').orderByKey();
      query.once("value")
        .then((snapshot) => {
          snapshot.forEach(chilSnapshot => {
            if (key == chilSnapshot.val()['group_code']) {
              const subRemove = this.afd.database.ref(`/subjects/${chilSnapshot.val()['subject_code']}`);
              subRemove.remove();
              const imgRemove = firebase.storage().ref(`QRCode/${chilSnapshot.val()['subject_code']}.png`);
              imgRemove.delete();
            }
          });
        });

        query = this.afd.database.ref('classrooms').orderByKey();
      query.once("value")
        .then((snapshot) => {
          snapshot.forEach(chilSnapshot => {
            if (key == chilSnapshot.val()['group_code']) {
              const classroom = this.afd.database.ref(`/classrooms/${chilSnapshot.key}`);
              classroom.remove();
            }
          });
        });





    }
    // "Admin"
    else {
    }
  }

  getSubject(group_code: any) {
    return new Promise(resolve => {
      this.afd.database.ref('subjects').orderByKey().once("value")
        .then((snapshot) => {
          this.subject = [];
          snapshot.forEach(childSnapshot => {
            if (group_code == childSnapshot.val()['group_code']) {
              this.subject.push(childSnapshot.val());
            }
          });
          resolve(this.subject);
        });
    })
  }

  getSubjectbyOwner(owner_code: any) {
    return new Promise(resolve => {
      this.afd.database.ref('subjects').orderByKey().once("value")
        .then((snapshot) => {
          this.subject = [];
          snapshot.forEach(childSnapshot => {
            if (owner_code == childSnapshot.val()['owner_code']) {
              this.subject.push(childSnapshot.val());
            }
          });
          resolve(this.subject);
        });
    })
  }

  removeSubject(sub_code: any) {
    const groupRemove = this.afd.database.ref(`/subjects/${sub_code}`);
    groupRemove.remove();
    const imgRemove = firebase.storage().ref(`QRCode/${sub_code}.png`);
    imgRemove.delete();
  }

  updategroupname(group_code: any, group_name: any) {
    return new Promise(resolve => {
      let group = {
        group_name: group_name,
      }
      const groupSave = this.afd.database.ref(`/groups/${group_code}`);
      groupSave.update(group).then((res) => resolve("success"), err => resolve("error"));
    })
  }

  pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  calculateTime(start: string) {

    let timestart = Date.parse("01/01/2019 " + start + ":00");
    let timestarts = timestart - 900000
    let timelatestart = timestart + 600000
    let timelateend = timelatestart + 600000
    let datetimestart = new Date(timestarts)
    let datetimelatestart = new Date(timelatestart)
    let datetimelateend = new Date(timelateend)

    let time = {
      time_stamp_start: ("0" + (datetimestart.getHours())).substr(-2) + ":" + ("0" + (datetimestart.getMinutes())).substr(-2),
      time_stamp_late_start: ("0" + (datetimelatestart.getHours())).substr(-2) + ":" + ("0" + (datetimelatestart.getMinutes())).substr(-2),
      time_stamp_late_end: ("0" + (datetimelateend.getHours())).substr(-2) + ":" + ("0" + (datetimelateend.getMinutes())).substr(-2)
    }

    return time;
  }


  //
  checkInviteCode(invitecode: any) {
    return new Promise((resolve) => {
      this.afd.database.ref('groups').orderByKey().once("value")
        .then((snapshot) => {
          let data;
          if (snapshot.val()) {
            snapshot.forEach((childSnapshot) => {
              if (invitecode == childSnapshot.val()['invite_code']) {
                data = { status: true, group_code: childSnapshot.val()['group_code'] };
                resolve(data);
              } else {
                data = { status: false }
              }
            });
          } else {
            data = { status: false }
          }
          resolve(data);
        });
    });
  }

  checkSthasGroup(uid: any, group_code: any) {
    return new Promise((resolve) => {
      this.afd.database.ref('classrooms').orderByKey().once("value")
        .then((snapshot) => {
          let data;
          if (snapshot.val()) {
            snapshot.forEach((childSnapshot) => {
              if (childSnapshot.val()) {
                if (group_code == childSnapshot.val()['group_code'] && uid == childSnapshot.val()['uid']) {
                  data = { status: true };
                  resolve(data);
                } else {
                  data = { status: false };
                }
              } else {
                data = { status: false };
              }
            });
          } else {
            data = { status: false };
          }
          resolve(data);
        });
    });
  }

  joinClassroom(invite_code: any, uid: any, fullname: any) {
    return new Promise((resolve) => {
      this.checkInviteCode(invite_code).then((res) => {

        if (res['status']) {
          this.checkSthasGroup(uid, res['group_code']).then((resp) => {
            console.log(JSON.stringify(resp));
            if (resp) {
              if (resp['status']) {
                resolve({ status: false, message: "คุณอยู่ในกลุ่มนี้อยู่แล้วครับผมมม" });
              } else {
                let classroom = {
                  group_code: res['group_code'],
                  uid: uid,
                  fullname: fullname
                }
                const classroomSave = this.afd.database.ref(`/classrooms/${this.afd.database.ref().push().key}`);
                classroomSave.set(classroom).then(() => {
                  resolve({ status: true, message: "เพิ่มกลุ่มเรียนเรียบร้อยยยย" });
                })

              }
            }

          });
        } else {
          resolve({ status: false, message: "Invite Code ไม่ถูกต้อง" })
        }
      });
    });
  }

}
