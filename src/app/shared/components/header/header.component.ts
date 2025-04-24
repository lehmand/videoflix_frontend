import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service/auth.service';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../../services/navigation-service/navigation.service';
import { VideoService } from '../../../services/video-service/video.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  logoSrc: string = 'assets/img/logo.svg'

  constructor(
    public authService: AuthService,
    private router: Router,
    private videoService: VideoService,
  ){
    this.updateLogo()
  }

  @HostListener('window:resize', [])
  onResize() {
    this.updateLogo()
  }

  updateLogo() {
    this.logoSrc = window.innerWidth < 768 ? 'assets/img/logo-mobile.svg' : 'assets/img/logo.svg'
  }

  logout(){
    this.authService.logout()
  }

  checkUserLogin(){
    const route = this.authService.isLoggedIn ? '/main' : '/login'
    this.router.navigate([route])
    this.videoService.isPlaying = false
    this.videoService.selectedVideo = null;
  }

}
