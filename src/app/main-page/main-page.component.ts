import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data-service/data.service';
import { Video } from '../models/video';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  imports: [CommonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit {

  MEDIA_BASE_URL = 'http://127.0.0.1:8000'
  categories: Array<string> = ['Aviation', 'Places', 'Animals', 'Anime']
  allVideos: Array<any> = []
  selectedVideo: any = null
  
  constructor(
    private dataService: DataService,
    private router: Router
  ){}
  
  ngOnInit(): void {
    this.dataService.getVideos().subscribe({
      next: videos => {
        this.allVideos = videos.map(video => ({
          ...video,
          thumbnail: this.MEDIA_BASE_URL + video.thumbnail
        }))
        console.log(this.allVideos)
        this.selectedVideo = this.allVideos[0]
      },
      error: err => console.error(err)
    })
  }

  getVideosByCategory(cat: string): Video[] {
    return this.allVideos.filter(v => v.genre === cat);
  }

  selectVideo(video: any) {
    this.selectedVideo = video
  }

  getRecentVideos(): any[] {
    const now = new Date();
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(now.getDate() - 3);
  
    return this.allVideos.filter(video => {
      const uploaded = new Date(video.uploaded_at);
      return uploaded >= threeDaysAgo;
    });
  }

  playVideo(videoId: number): void {
    this.router.navigate(['/video', videoId]);
  }

}
