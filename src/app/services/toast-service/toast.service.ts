import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  public showToastMessage: boolean = false;
  public toastMessage: string = '';
  public isSuccessful: boolean = false;

  show(message: string, duration: number = 2000, isSuccess?: boolean) {
    this.toastMessage = message;
    this.showToastMessage = true;

    if(isSuccess !== undefined) {
      this.setState(isSuccess)
    }

    setTimeout(() => {
      this.showToastMessage = false;
    }, duration);
  }

  setState(state: boolean, resetAfter: number = 5000) {
    this.isSuccessful = state;

    setTimeout(() => {
      this.isSuccessful = false;
    }, resetAfter);
  }
}
