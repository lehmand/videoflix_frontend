import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data-service/data.service';
import { Video } from '../models/video';
import { Router } from '@angular/router';
import { VideoService } from '../services/video-service/video.service';
import { NavigationService } from '../services/navigation-service/navigation.service';

@Component({
  selector: 'app-main-page',
  imports: [CommonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit, AfterViewInit {
  @ViewChild('previewVideo') previewVideo!: ElementRef<HTMLVideoElement>;

  MEDIA_BASE_URL = 'https://vid.daniel-lehmann.dev/'
  categories: Array<string> = ['Drone', 'Motivation', 'Animals', 'Technology']
  
  
  constructor(
    private dataService: DataService,
    private router: Router,
    public videoService: VideoService,
    private navigation: NavigationService,
  ){}

  @HostListener('window:resize', [])
  onResize(){
    this.videoService.checkViewport()

    if (this.previewVideo && this.previewVideo.nativeElement) {
      this.previewVideo.nativeElement.volume = 0;
      this.previewVideo.nativeElement.muted = true;
    }
  }
  
  ngOnInit(): void {
    this.navigation.isOnMainPage = true;
    this.videoService.checkViewport()
    this.dataService.getVideos().subscribe({
      next: videos => {
        this.videoService.allVideos = videos.map(video => ({
          ...video,
          thumbnail: this.MEDIA_BASE_URL + video.thumbnail
        }))
        this.videoService.selectedVideo = this.videoService.isMobile ? null : this.videoService.allVideos[0]
      },
      error: err => console.error(err)
    })
    this.previewVideo.nativeElement.volume = 0;
    this.previewVideo.nativeElement.muted = true;
  }

  shouldShowMobileInfo(): boolean {
    return this.router.url === '/main';
  }

  ngAfterViewInit() {
    if (this.previewVideo && this.previewVideo.nativeElement) {
      this.previewVideo.nativeElement.volume = 0;
      this.previewVideo.nativeElement.muted = true;

      this.previewVideo.nativeElement.addEventListener('loadeddata', () => {
        this.previewVideo.nativeElement.volume = 0;
        this.previewVideo.nativeElement.muted = true;
      });
    }
  }

  getVideoPreviewUrl(video: any): string {
    if (!video || !video.file) return '';
    return this.MEDIA_BASE_URL + video.file;
  }

  getVideosByCategory(cat: string): Video[] {
    return this.videoService.allVideos.filter(v => v.genre === cat);
  }

  selectVideo(video: any) {
    this.videoService.selectedVideo = video;
    
    if (this.previewVideo && this.previewVideo.nativeElement) {
      setTimeout(() => {
        this.previewVideo.nativeElement.volume = 0;
        this.previewVideo.nativeElement.muted = true;
        this.previewVideo.nativeElement.load();
        this.previewVideo.nativeElement.play();
      }, 100);
    }
  }

  getRecentVideos(): any[] {
    const sortedVideos = [...this.videoService.allVideos].sort((a, b) => {
      return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
    });
    
    return sortedVideos.slice(0, 6);
  }

  playVideo(videoId: number): void {
    if (this.videoService.isLandscape || this.videoService.isMobile) {
      this.videoService.requestFullscreenOnPlay = true;
    }

    this.router.navigate(['/video', videoId]);
    this.videoService.isPlaying = true
  }

}
