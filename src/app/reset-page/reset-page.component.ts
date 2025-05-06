import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../services/toast-service/toast.service';
import { ToastMessageComponent } from '../shared/components/toast-message/toast-message.component';
import { environment } from '../../environments/environment';
import { timer } from 'rxjs';

@Component({
  selector: 'app-reset-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastMessageComponent],
  templateUrl: './reset-page.component.html',
  styleUrl: './reset-page.component.scss'
})
export class ResetPageComponent implements OnInit {
  static passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value === confirmPassword.value ? null : { 'mismatch': true };
  };

  private uidb64: string = '';
  private token: string = '';
  isLoading: boolean = false;
  isTokenValid: boolean = true;

  resetForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: ResetPageComponent.passwordMatchValidator });

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    public toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.uidb64 = params['uidb64'];
      this.token = params['token'];
      
      if (!this.uidb64 || !this.token) {
        this.isTokenValid = false;
        this.toastService.show('Invalid reset-link. Please request a new.')
        timer(3000).subscribe(() => {
          this.router.navigate(['/forgot-password']);
        });
      }
    });
  }

  resetPassword() {
    if (this.resetForm.invalid || !this.isTokenValid) {
      return;
    }

    this.isLoading = true;
    const resetData = {
      new_password: this.resetForm.get('password')?.value,
      new_password2: this.resetForm.get('confirmPassword')?.value
    };

    const resetUrl = `https://vid.daniel-lehmann.dev/api/auth/reset/${this.uidb64}/${this.token}/`;

    this.http.post(resetUrl, resetData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.toastService.show('Password reset successful. You can login now.')
        timer(3000).subscribe(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Password reset failed', error);
        if (error.error && error.error.message) {
          this.toastService.show(error.error.message)
        } else {
          this.toastService.show('Password reset failed. Please try again.')
        }
        this.toastService.showToastMessage = true;
      }
    });
  }

  get passwordControl() { 
    return this.resetForm.get('password'); 
  }
  
  get confirmPasswordControl() { 
    return this.resetForm.get('confirmPassword'); 
  }
  
  hasPasswordMismatch() {
    return this.resetForm.hasError('mismatch') && 
           this.confirmPasswordControl?.touched && 
           !this.confirmPasswordControl?.hasError('required');
  }
}