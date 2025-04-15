import { Component, inject, OnInit } from '@angular/core';
import { HttpService } from '../services/http-service/http.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service/auth.service';
import { ToastService } from '../services/toast-service/toast.service';
import { ToastMessageComponent } from '../shared/components/toast-message/toast-message.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-landing-page',
  imports: [ReactiveFormsModule, ToastMessageComponent, CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit {

  constructor(
    private httpService: HttpService,
    private router: Router,
    private authService: AuthService,
    public toastService: ToastService
  ){}

  ngOnInit(): void {
    this.toastService.showToastMessage = false
  }

  emailForm = new FormGroup({
    email: new FormControl('')
  })

  checkUser() {
    if (this.emailForm.invalid) {
      console.error('Form error!');
      return;
    }
  
    const emailInput = this.emailForm.get('email')?.value;
    if (!emailInput) {
      console.error('No email provided.');
      return;
    }
  
    this.authService.checkUser(emailInput).subscribe({
      next: (response: any) => {
        if (response.ok) {
          this.toastService.toastMessage = 'Email already exists. Redirecting to log in.'
          this.toastService.showToastMessage = true;
          setTimeout(() => {
            this.router.navigate(['/login']);
            this.toastService.showToastMessage = false;
          }, 2000);
        } else {
          this.toastService.toastMessage = 'Email not found. Redirecting to sign up.'
          this.toastService.showToastMessage = true;
          setTimeout(() => {
            this.router.navigate(['/signup']);
            this.toastService.showToastMessage = false;
          }, 2000);
        }
      },
      error: (err: any) => {
        console.error('Error at request: ', err);
        this.toastService.toastMessage = 'An error occurred. Please try again later.';
        this.toastService.showToastMessage = true;
      }
    });
  }
}
