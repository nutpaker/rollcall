import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {AngularFireAuth} from 'angularfire2/auth'; 

/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationProvider {

  constructor(public http: HttpClient,private Auth:AngularFireAuth) {
  }

  login(loginForm){
    return this.Auth.auth.signInAndRetrieveDataWithEmailAndPassword(loginForm.email,loginForm.password);
  }

  logout(){
    return this.Auth.auth.signOut();
  }


}
