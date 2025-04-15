import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-forgot-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-page.component.html',
  styleUrl: './forgot-page.component.scss'
})
export class ForgotPageComponent {

  constructor(){}

  email: string = ''

}
