import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Video } from '../models/video';
import { VideoPlayerComponent } from '../shared/components/video-player/video-player.component';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data-service/data.service';
import { VideoService } from '../services/video-service/video.service';

interface VideoSource {
  src: string;
  type: string;
  label?: string;
  quality?: string;
}

@Component({
  selector: 'app-video-page',
  imports: [CommonModule, VideoPlayerComponent],
  templateUrl: './video-page.component.html',
  styleUrl: './video-page.component.scss',
})
export class VideoPageComponent implements OnInit, OnDestroy {
  videoId: number = 0;
  video: Video | null = null;
  MEDIA_BASE_URL = 'https://vid.daniel-lehmann.dev/';
  loading: boolean = true;
  error: string | null = null;
  videoSources: VideoSource[] = [];
  currentQuality: string = 'Original';
  requestFullscreen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    public videoService: VideoService,
  ) {}

  @HostListener('window:resize', [])
  onResize() {
    this.videoService.checkViewport();
  }

  ngOnInit(): void {
    this.videoService.checkViewport();

    this.requestFullscreen = this.videoService.isLandscape;
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.videoId = +id;
        this.loadVideo();
      }
    });
  }

  ngOnDestroy(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error(err));
    }
  }

  loadVideo(): void {
    this.loading = true;
    this.dataService.getVideoById(this.videoId).subscribe({
      next: (video) => {
        this.video = video;
        this.prepareVideoSources();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading video:', err);
        this.error = 'Could not load the video. Please try again later.';
        this.loading = false;
      },
    });
  }

  prepareVideoSources(): void {
    if (!this.video) return;

    const filePath = this.video.file;
    const lastSlashIndex = filePath.lastIndexOf('/');
    const lastDotIndex = filePath.lastIndexOf('.');
    
    const directoryPath = lastSlashIndex !== -1 ? filePath.substring(0, lastSlashIndex + 1) : '';
    
    const fileName = filePath.substring(lastSlashIndex + 1, lastDotIndex);
    
    const extension = filePath.substring(lastDotIndex);
    
    const originalPath = this.video.file;
    const path480p = directoryPath + fileName + '_480p' + extension;
    const path720p = directoryPath + fileName + '_720p' + extension;
    
    this.videoSources = [
      {
        src: this.MEDIA_BASE_URL + originalPath,
        type: 'video/mp4',
        label: 'Original',
        quality: 'original'
      },
      {
        src: this.MEDIA_BASE_URL + path480p,
        type: 'video/mp4',
        label: '480p SD',
        quality: '480p'
      },
      {
        src: this.MEDIA_BASE_URL + path720p,
        type: 'video/mp4',
        label: '720p HD',
        quality: '720p'
      }
    ];
  }

selectQuality(quality: string): void {
  this.currentQuality = quality;
  
  const selectedSource = this.videoSources.find(source => source.quality === quality);
  if (!selectedSource) {
    console.error(`No source found for quality: ${quality}`);
    return;
  }
  
  const videoElement = document.querySelector('video');
  if (!videoElement) {
    console.error('Video element not found in DOM');
    return;
  }
  
  const currentTime = videoElement.currentTime;
  const wasPlaying = !videoElement.paused;
  
  videoElement.src = selectedSource.src;
  
  videoElement.onloadedmetadata = () => {
    videoElement.currentTime = currentTime;
    
    if (wasPlaying) {
      videoElement.play();
    }
  };
}

  getFullVideoUrl(): string {
    if (!this.video) return '';
    return this.MEDIA_BASE_URL + this.video.file;
  }

  getFullThumbnailUrl(): string {
    if (!this.video) return '';
    return this.MEDIA_BASE_URL + this.video.thumbnail;
  }
}
