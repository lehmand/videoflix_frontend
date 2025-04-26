import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data-service/data.service';
import { Video } from '../models/video';
import { Router } from '@angular/router';
import { VideoService } from '../services/video-service/video.service';

@Component({
  selector: 'app-main-page',
  imports: [CommonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit, AfterViewInit {
  @ViewChild('previewVideo') previewVideo!: ElementRef<HTMLVideoElement>;

  MEDIA_BASE_URL = 'http://127.0.0.1:8000'
  categories: Array<string> = ['Aviation', 'Places', 'Animals', 'Anime']
  
  
  constructor(
    private dataService: DataService,
    private router: Router,
    public videoService: VideoService
  ){}

  @HostListener('window:resize', [])
  onResize(){
    this.checkViewport()
  }
  
  ngOnInit(): void {
    this.checkViewport()
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
  }

  shouldShowMobileInfo(): boolean {
    return this.router.url === '/main';
  }

  checkViewport() {
    const isLandscape = window.innerWidth > window.innerHeight;
    const randomIndex = Math.floor(Math.random() * this.videoService.allVideos.length)
    this.videoService.isMobile = window.innerWidth < 992;
    this.videoService.isLandscape = isLandscape && window.innerWidth < 992
    if(window.innerWidth > 992 && !this.videoService.selectedVideo) {
      this.videoService.selectedVideo = this.videoService.allVideos[randomIndex]
    }
  }

  ngAfterViewInit() {
    if (this.previewVideo && this.previewVideo.nativeElement) {
      this.previewVideo.nativeElement.volume = 0;
      this.previewVideo.nativeElement.muted = true;
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
    const now = new Date();
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(now.getDate() - 3);
  
    return this.videoService.allVideos.filter(video => {
      const uploaded = new Date(video.uploaded_at);
      return uploaded >= threeDaysAgo;
    });
  }

  playVideo(videoId: number): void {
    this.router.navigate(['/video', videoId]);
    this.videoService.isPlaying = true
  }

}
