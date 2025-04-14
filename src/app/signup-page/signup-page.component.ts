import { Component } from '@angular/core';
import { AuthService } from '../services/auth-service/auth.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationService } from '../services/navigation-service/navigation.service';

@Component({
  selector: 'app-signup-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.scss'
})
export class SignupPageComponent {

  constructor(
    private authService: AuthService,
    private navigator: NavigationService
  ){}

  signUpForm = new FormGroup({
    email: new FormControl('',[ Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    repeated_password: new FormControl('', [Validators.required])
  })

  register() {
    this.authService.registration(this.signUpForm.value).subscribe({
      next: (response) => {
        console.log('Registration success', response)
        this.navigator.navigateTo('login')
      },
      error: (error) => {
        console.error('Registration failed', error)
        return
      }
    })
  }
}
