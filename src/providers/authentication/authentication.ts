import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class AuthenticationProvider {
  itemRef: AngularFireList<any>;
  items: Observable<any[]>;
  constructor(public http: HttpClient, private auth: AngularFireAuth, private af: AngularFireDatabase) {
  }

  login(loginForm) {
    return this.auth.auth.signInAndRetrieveDataWithEmailAndPassword(loginForm.email, loginForm.password);
  }

  logout() {
    return this.auth.auth.signOut();
  }

  getCurrentUser() {
    return new Promise(resolve => {
      this.auth.auth.onAuthStateChanged(user => {
        if (user) {
          resolve(user.uid);
        }
      })
    });
  }
  getProfile(uid: any) {
    return new Promise(resolve => {
      this.af.database.ref(`profiles/${uid}`).once('value')
        .then(res => {
          let datauser = res.val() ? res.val() : {};
          resolve(datauser);
        });
    });
  }
}
