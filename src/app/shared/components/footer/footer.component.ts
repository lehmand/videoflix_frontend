import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationService } from '../../../services/navigation-service/navigation.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { VideoService } from '../../../services/video-service/video.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {

  isSpecialPage: boolean = false;

  constructor(
    public navigation: NavigationService,
    public videoService: VideoService,
    public router: Router
  ){
    this.checkCurrentRoute()
  }

  ngOnInit(): void {
    this.checkCurrentRoute()
    this.router.events.subscribe(() => {
      this.checkCurrentRoute()
    })
  }

  checkCurrentRoute() {
    const currentUrl = this.router.url;
    this.isSpecialPage = currentUrl.includes('/privacy') || currentUrl.includes('/imprint')
  }
}
