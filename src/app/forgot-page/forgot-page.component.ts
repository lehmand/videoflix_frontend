import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth-service/auth.service';
import { NavigationService } from '../services/navigation-service/navigation.service';


@Component({
  selector: 'app-forgot-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-page.component.html',
  styleUrl: './forgot-page.component.scss'
})
export class ForgotPageComponent {

  constructor(
    private authService: AuthService,
    private navigation: NavigationService,
  ){}

  email: string = ''

  resetPassword(){
    this.authService.reset({ email: this.email }).subscribe({
      next: (response) => {
        console.log('Password reset successfull.', response)
        this.navigation.navigateTo('login')
      },
      error: (error) => {
        console.log('Password reset failed.')
      }
    })
  }

}
