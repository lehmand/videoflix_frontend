import { Component, inject, OnInit } from '@angular/core';
import { HttpService } from '../services/http-service/http.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service/auth.service';


@Component({
  selector: 'app-landing-page',
  imports: [ReactiveFormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  constructor(
    private httpService: HttpService,
    private router: Router,
    private authService: AuthService,
  ){}

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
          this.router.navigate(['/login']);
        } else {
          this.router.navigate(['/signup']);
        }
      },
      error: (err: any) => {
        console.error('Error at request: ', err);
      }
    });
  }
}
