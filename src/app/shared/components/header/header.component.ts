import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  logoSrc: string = 'assets/img/logo.svg'

  constructor(
    public authService: AuthService
  ){
    this.updateLogo()
  }

  @HostListener('window:resize', [])
  onResize() {
    this.updateLogo()
  }

  updateLogo() {
    this.logoSrc = window.innerWidth < 500 ? 'assets/img/logo-mobile.svg' : 'assets/img/logo.svg'
  }

  logout(){
    this.authService.logout()
  }

}
