import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  public showToastMessage: boolean = false;
  public toastMessage: string = '';

  show(message: string, duration: number = 2000) {
    this.toastMessage = message;
    this.showToastMessage = true;

    setTimeout(() => {
      this.showToastMessage = false;
    }, duration);
  }
}
