import { Component, inject, OnInit } from '@angular/core';
import { HttpService } from '../services/http-service/http.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service/auth.service';
import { ToastService } from '../services/toast-service/toast.service';
import { ToastMessageComponent } from '../shared/components/toast-message/toast-message.component';
import { CommonModule } from '@angular/common';
import { timer } from 'rxjs';


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
      next: resp => {
        if(resp.ok) {
          this.toastService.setState(true);
        }
        const message = resp.ok
          ? 'Email already exists. Redirecting to log in.'
          : 'Email not found. Redirecting to sign up.';
        const path = resp.ok ? '/login' : '/signup';
        this.showToastAndRedirect(message, path);
      },
      error: err => {
        console.error('Request‑Error:', err);
        this.toastService.show('An error occurred. Please try again later.')
      }
    });
  }

  private showToastAndRedirect(message: string, path: string) {
    this.toastService.show(message)
    timer(2000).subscribe(() => {
      this.router.navigate([path]);
    });
  }
}
