import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor() { }

  private http = inject(HttpClient)


  getToken(): string | null{
    return sessionStorage.getItem('token') || localStorage.getItem('token')
  }

  getHeaders(): HttpHeaders {
    const token = this.getToken()
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if(token) { headers = headers.set('Authorization', `Token ${token}`)};
    return headers
  }

  post(url: string, body: any){
    return this.http.post(url, body, { headers: this.getHeaders()})
  }

  patch(url: string, body: any){
    return this.http.patch(url, body, { headers: this.getHeaders()})
  }

  get<T>(url: string): Observable<T>{
    return this.http.get<T>(url, { headers: this.getHeaders()})
  }

}
