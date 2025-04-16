import { Component, HostListener, OnInit } from '@angular/core';
import { ToastService } from '../../../services/toast-service/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-message',
  imports: [CommonModule],
  templateUrl: './toast-message.component.html',
  styleUrl: './toast-message.component.scss'
})
export class ToastMessageComponent implements OnInit {
  
  isMobile: boolean = false

  constructor(
    public toastService: ToastService
  ){}


  ngOnInit(): void {
    this.checkViewport()
  }

  @HostListener('window:resize')
  onResize() {
    this.checkViewport()
  }

  checkViewport() {
    this.isMobile = window.innerWidth < 768
  }

  close() {
    this.toastService.showToastMessage = false
  }
}
