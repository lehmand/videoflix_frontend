import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  isPlaying: boolean = false;
  isMobile: boolean = false;
  selectedVideo: any = null;
  allVideos: Array<any> = [];
  isLandscape: boolean = false;
  requestFullscreenOnPlay: boolean = false;

  constructor() { }



  checkViewport() {
    const isLandscape = window.innerWidth > window.innerHeight;
    this.isMobile = window.innerWidth < 992;
    this.isLandscape = isLandscape && window.innerWidth < 992
    if(window.innerWidth > 992 && !this.selectedVideo) {
      this.selectedVideo = this.allVideos[0]
    }

    if(window.innerWidth < 992 && this.selectedVideo) {
      this.selectedVideo = null;
    }
  }
}
