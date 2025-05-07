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
        this.toastService.show('Registration successful! An activation link has been sent to your email address. Please check your inbox.')
        setTimeout(() => {
          this.navigator.navigateTo('login')
        }, 5000);
      },
      error: (error) => {
        this.toastService.show('Registration failed. Please check your information and try again.')
        return
      }
    })
  }
}
