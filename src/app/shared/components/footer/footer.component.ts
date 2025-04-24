import { Component, HostListener } from '@angular/core';
import { NavigationService } from '../../../services/navigation-service/navigation.service';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../../services/video-service/video.service';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  constructor(
    public navigation: NavigationService,
    public videoService: VideoService
  ){}
}
