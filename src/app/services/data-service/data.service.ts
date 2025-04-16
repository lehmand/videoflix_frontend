import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { Video } from '../../models/video';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly BASE_URL = 'http://127.0.0.1:8000/videos/video-page/'

  constructor(
    private httpService: HttpService,
  ) { }

  getVideos(): Observable<Video[]> {
    return this.httpService.get<Video[]>(this.BASE_URL)
  }
}
