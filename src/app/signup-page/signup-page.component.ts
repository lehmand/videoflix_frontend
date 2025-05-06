import { Component } from '@angular/core';
import { AuthService } from '../services/auth-service/auth.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationService } from '../services/navigation-service/navigation.service';
import { ToastService } from '../services/toast-service/toast.service';
import { ToastMessageComponent } from '../shared/components/toast-message/toast-message.component';

@Component({
  selector: 'app-signup-page',
  imports: [CommonModule, ReactiveFormsModule, ToastMessageComponent],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.scss'
})
export class SignupPageComponent {

  constructor(
    private authService: AuthService,
    private navigator: NavigationService,
    public toastService: ToastService
  ){}

  signUpForm = new FormGroup({
    email: new FormControl('',[ Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    repeated_password: new FormControl('', [Validators.required])
  })

  register() {
    this.authService.registration(this.signUpForm.value).subscribe({
      next: (response) => {
        this.navigator.navigateTo('login')
      },
      error: (error) => {
        console.error('Registration failed', error)
        
        this.toastService.toastMessage = 'Registration failed. Please check your information and try again.';
        this.toastService.showToastMessage = true;
        setTimeout(() => {
          this.toastService.showToastMessage = false
        }, 2000);
        return
      }
    })
  }
}
