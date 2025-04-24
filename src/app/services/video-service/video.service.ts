import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  isPlaying: boolean = false;
  isMobile: boolean = false;
  selectedVideo: any = null

  constructor() { }
}
