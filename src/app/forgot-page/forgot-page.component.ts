import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth-service/auth.service';
import { NavigationService } from '../services/navigation-service/navigation.service';
import { ToastService } from '../services/toast-service/toast.service';
import { ToastMessageComponent } from '../shared/components/toast-message/toast-message.component';


@Component({
  selector: 'app-forgot-page',
  imports: [CommonModule, FormsModule, ToastMessageComponent],
  templateUrl: './forgot-page.component.html',
  styleUrl: './forgot-page.component.scss'
})
export class ForgotPageComponent {

  constructor(
    private authService: AuthService,
    private navigation: NavigationService,
    public toastService: ToastService
  ){}

  email: string = ''

  resetPassword(){
    this.authService.reset({ email: this.email }).subscribe({
      next: (response) => {
        this.toastService.showToastMessage = true;
        this.toastService.toastMessage = 'Password reset link has been sent to your email.'
        setTimeout(() => {
          this.toastService.showToastMessage = false
          this.navigation.navigateTo('login')
        }, 2000);
      },
      error: (error) => {
        console.log('Password reset failed.')
      }
    })
  }

}
