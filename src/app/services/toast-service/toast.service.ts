import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  public showToastMessage: boolean = false;
  public toastMessage: string = '';
  public isSuccessful: boolean = false;

  show(message: string, duration: number = 2000) {
    this.toastMessage = message;
    this.showToastMessage = true;

    setTimeout(() => {
      this.showToastMessage = false;
    }, duration);
  }

  setState(state: boolean) {
    this.isSuccessful = state;

    setTimeout(() => {
      this.isSuccessful = false;
    }, 5000);
  }
}
