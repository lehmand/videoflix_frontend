import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  public showToastMessage: boolean = false;
  public toastMessage: string = '';
}
