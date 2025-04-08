import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-main-page',
  imports: [CommonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

  constructor(){}

  categories: Array<string> = ['New on Videoflix', 'Aviation', 'Places', 'Animals', 'Anime']

}
