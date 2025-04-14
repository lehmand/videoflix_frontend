import { Component } from '@angular/core';
import { ToastService } from '../../../services/toast-service/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-message',
  imports: [CommonModule],
  templateUrl: './toast-message.component.html',
  styleUrl: './toast-message.component.scss'
})
export class ToastMessageComponent {

  constructor(
    public toastService: ToastService
  ){}
}
