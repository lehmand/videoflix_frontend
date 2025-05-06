import { Component, HostListener } from '@angular/core';
import { NavigationService } from '../../../services/navigation-service/navigation.service';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../../services/video-service/video.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  constructor(
    public navigation: NavigationService,
    public videoService: VideoService,
  ){}
}
