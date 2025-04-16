import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data-service/data.service';
import { Video } from '../models/video';
import { environment } from '../environment';

@Component({
  selector: 'app-main-page',
  imports: [CommonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit {
  public environment = environment

  categories: Array<string> = ['New on Videoflix', 'Aviation', 'Places', 'Animals', 'Anime']
  allVideos: Array<any> = []

  constructor(
    private dataService: DataService
  ){}

  ngOnInit(): void {
    this.dataService.getVideos().subscribe({
      next: videos => {
        this.allVideos = videos
      },
      error: err => console.error(err)
    })
  }

  getVideosByCategory(cat: string): Video[] {
    return this.allVideos.filter(v => v.genre === cat);
  }

}
