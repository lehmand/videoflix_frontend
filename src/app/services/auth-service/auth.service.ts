import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  BASE_URL = 'http://127.0.0.1:8000/';
  AUTH_URL = 'auth/'
  sessionEmail: string | null;

  constructor(
    private httpService: HttpService
  ) {
      this.sessionEmail = ''
   }


  checkUser(email: string): Observable<any> {
    return this.httpService.post(`${this.BASE_URL}${this.AUTH_URL}check/`, { email })
  }

  getEmail(){
    this.sessionEmail = sessionStorage.getItem('email')
  }
}
