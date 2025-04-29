import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { Video } from '../../models/video';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly BASE_URL = 'https://vid.daniel-lehmann.dev/api/videos/video-page/'

  constructor(
    private httpService: HttpService,
  ) { }

  getVideos(): Observable<Video[]> {
    return this.httpService.get<Video[]>(this.BASE_URL)
  }

  getVideoById(id: number): Observable<Video> {
    return this.httpService.get<Video>(`${this.BASE_URL}${id}/`)
  }
}
