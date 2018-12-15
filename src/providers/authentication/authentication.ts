import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {AngularFireAuth} from 'angularfire2/auth'; 
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthenticationProvider {
  itemRef: AngularFireList<any>;
  items: Observable<any[]>;
  constructor(public http: HttpClient,private auth:AngularFireAuth,private af: AngularFireDatabase) {
  }

  login(loginForm){
    return this.auth.auth.signInAndRetrieveDataWithEmailAndPassword(loginForm.email,loginForm.password);
  }

  logout(){
    return this.auth.auth.signOut();
  }

  studentidChk(stuid:string):Boolean{
    this.itemRef = this.af.list("/profiles");
    this.items = this.itemRef.snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          key: c.payload.key, ...c.payload.val()
        }));
      });
    this.items.forEach(res => {
      let profiles = <any>res;
      for (let i of profiles) {
        if (i.student_id == stuid) {
          return true
        }
      }
    });
    return false
  }
}
