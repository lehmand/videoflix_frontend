import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Video } from '../models/video';
import { VideoPlayerComponent } from '../shared/components/video-player/video-player.component';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data-service/data.service';

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
  styleUrl: './video-page.component.scss'
})
export class VideoPageComponent implements OnInit {

  videoId: number = 0;
  video: Video | null = null;
  MEDIA_BASE_URL = 'http://127.0.0.1:8000/';
  loading: boolean = true;
  error: string | null = null;
  videoSources: VideoSource[] = [];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
  ){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.videoId = +id;
        this.loadVideo();
      }
    });
  }

  loadVideo(): void {
    this.loading = true;
    this.dataService.getVideoById(this.videoId).subscribe({
      next: (video) => {
        this.video = video;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading video:', err);
        this.error = 'Could not load the video. Please try again later.';
        this.loading = false;
      }
    });
  }

  prepareVideoSources(): void {
    if (!this.video) return;
    
    const filePath = this.video.file;
    const lastDotIndex = filePath.lastIndexOf('.');
    const baseFilePath = filePath.substring(0, lastDotIndex);
    
    this.videoSources = [
      {
        src: this.MEDIA_BASE_URL + baseFilePath + '_480p.mp4',
        type: 'video/mp4',
        label: '480p SD',
        quality: '480p'
      },
      {
        src: this.MEDIA_BASE_URL + baseFilePath + '_720p.mp4',
        type: 'video/mp4',
        label: '720p HD',
        quality: '720p'
      },
      {
        src: this.MEDIA_BASE_URL + this.video.file,
        type: 'video/mp4',
        label: 'Original',
        quality: 'original'
      }
    ];
    
    // Optional: Add HLS sources if available
    // HLS streaming requires additional setup, but this is how we would define sources
    /*
    this.videoSources.push({
      src: this.MEDIA_BASE_URL + baseFilePath + '_480p_hls/playlist.m3u8',
      type: 'application/x-mpegURL',
      label: '480p HLS',
      quality: '480p-hls'
    });
    
    this.videoSources.push({
      src: this.MEDIA_BASE_URL + baseFilePath + '_720p_hls/playlist.m3u8',
      type: 'application/x-mpegURL',
      label: '720p HLS',
      quality: '720p-hls'
    });
    */
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
