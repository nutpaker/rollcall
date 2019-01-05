import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

// import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { AppSettings } from '../../envelopments/AppSettings';

@Injectable()
export class RegisterProvider {


  constructor(public http: HttpClient,
    private afa: AngularFireAuth,
    private afd: AngularFireDatabase,
  ) {
    console.log('Hello RegisterProvider Provider');

  }

  emailCheck(email: any) {
    return new Promise(resolve => {
      this.http.get(AppSettings.API_ENDPOINT + "email?id=" + email)
        .subscribe(data => {
          resolve(data);
        }, err => {
          resolve(err);
        });
    });
  }

  studentidCheck(student: any) {
    return new Promise(resolve => {
      this.http.get(AppSettings.API_ENDPOINT + "studentid?id=" + student)
        .subscribe(data => {
          resolve(data);
        }, err => {
          resolve(err);
        });
    });
  }

  register(regForm: any): Promise<any> {
    return this.afa.auth.createUserAndRetrieveDataWithEmailAndPassword(regForm.email, regForm.password)
      .then((res) => {
        this.createProfile(regForm, res.user.uid);
      });
  }

  createProfile(regForm: any, keys: any) {

    var profile = {
      uid: keys,
      email:regForm.email,
      student_id: regForm.studentid,
      fname: regForm.firstname,
      lname: regForm.lastname,
      faculty: regForm.faculty,
      major: regForm.major,
      role: 0
    };

    var key = keys;
    const toSend = this.afd.database.ref(`/profiles/${key}`);
    toSend.set(profile);
  }

}
