import { Component, HostListener, OnInit } from '@angular/core';
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
export class HeaderComponent implements OnInit {

  logoSrc: string = 'assets/img/logo.svg'
  isSpecialPage: boolean = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    public videoService: VideoService,
    public navigation: NavigationService,
  ){
    this.updateLogo();
    this.checkCurrentRoute();
  }

  ngOnInit(): void {
    this.checkCurrentRoute()
    this.router.events.subscribe(() => {
      this.checkCurrentRoute()
    })
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

  goBack(){
    this.navigation.goBack()
    this.isSpecialPage = false;
  }

  checkCurrentRoute() {
    const currentUrl = this.router.url;
    this.isSpecialPage = currentUrl.includes('/privacy') || currentUrl.includes('/imprint')
  }

  checkUserLogin(){
    const route = this.authService.isLoggedIn ? '/main' : '/login'
    this.router.navigate([route])
    this.videoService.isPlaying = false
    if(this.videoService.isMobile) {
      this.videoService.selectedVideo = null;
    }
  }

}
