import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service/auth.service';
import { NavigationService } from '../services/navigation-service/navigation.service';
import { ToastService } from '../services/toast-service/toast.service';
import { ToastMessageComponent } from '../shared/components/toast-message/toast-message.component';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, ToastMessageComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  constructor(
    private authService: AuthService,
    private navigation: NavigationService,
    public toastService: ToastService,
  ){}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  login(){
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login successfull', response)
        this.navigation.navigateTo('main')
        this.navigation.isOnMainPage = true
      },
      error: (error) => {
        console.error('Login failed', error)
        // Zeige Fehlermeldung in Toast an
        if (error.error && error.error.message) {
          this.toastService.toastMessage = error.error.message;
          this.toastService.showToastMessage = true;
        } else {
          this.toastService.toastMessage = 'Login fehlgeschlagen. Bitte versuche es erneut.';
          this.toastService.showToastMessage = true;
        }
      }
    })
  }

}
