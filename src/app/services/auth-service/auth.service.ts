import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { Observable, tap } from 'rxjs';
import { NavigationService } from '../navigation-service/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  BASE_URL = 'https://vid.daniel-lehmann.dev/api/auth/';
  sessionEmail: string | null = null;
  isLoggedIn: boolean = false;

  constructor(
    private httpService: HttpService,
    private navigation: NavigationService
  ) {
    this.checkAuthStatus();
    
  }

  checkAuthStatus() {
    const token = sessionStorage.getItem('token')
    const email = sessionStorage.getItem('email')
    if(email && token) {
      this.isLoggedIn = true
      this.sessionEmail = email
    } else {
      this.isLoggedIn = false;
      this.sessionEmail = null;
    }
  }

  checkUser(email: string): Observable<any> {
    return this.httpService.post(`${this.BASE_URL}check/`, { email });
  }

  getEmail() {
    this.sessionEmail = sessionStorage.getItem('email');
  }

  registration(data: any) {
    return this.httpService.post(`${this.BASE_URL}registration/`, data);
  }

  login(data: any) {
    return this.httpService.post(`${this.BASE_URL}login/`, data).pipe(
      tap((response: any) => {
        sessionStorage.setItem('email', response.email);
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('user_id', response.user_id.toString());
        this.isLoggedIn = true;
      })
    );
  }

  reset(data: any) {
    return this.httpService.post(`${this.BASE_URL}reset/`, data);
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('user_id');
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('user_id');
    this.navigation.navigateTo('login');
    this.isLoggedIn = false;
  }
}
