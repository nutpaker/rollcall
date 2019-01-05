import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { AngularFireDatabase } from 'angularfire2/database';


@Injectable()
export class ClassroomProvider {

  classroom: any[] = [];

  constructor(public http: HttpClient,
    private afd: AngularFireDatabase,
  ) {
    console.log('Hello ClassroomProvider Provider');
  }


  addGroup(classname: any, classroomdate: any, ownergroup: any) {

    let keygroup = this.afd.database.ref().push().key;
    let group = {
      group_name: classname,
      group_code: keygroup,
      invite_code: this.randomInvite(8),
      owner_code: ownergroup.uid,
    }
    const groupSave = this.afd.database.ref(`/groups/${keygroup}`);
    groupSave.set(group);
    this.addSub(classroomdate, keygroup, ownergroup);

  }

  addSub(classroomdate: any, groupcode: any, owner_group: any) {
    classroomdate.forEach(data => {
      let keysub = this.afd.database.ref().push().key;
      let sub = {
        subject_code: keysub,
        group_code: groupcode,
        owner_code: owner_group.uid,
        day: data.day,
        time_start: data.start,
        time_end: data.end,
        time_stamp_start: "",
        time_stamp_end: "",
        time_stamp_late_start: "",
        time_stamp_late_end: "",
        imgQR: ""
      }
      const subSave = this.afd.database.ref(`/subjects/${keysub}`);
      subSave.set(sub);
    });

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
        const subRemove = this.afd.database.ref(`/groups/${key}`);
        subRemove.remove();
      }
      // "Admin"
      else {
      }
  }

}
