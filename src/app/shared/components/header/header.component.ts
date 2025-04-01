import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  logoSrc: string = 'assets/img/logo.svg'

  constructor(){
    this.updateLogo()
  }

  @HostListener('window:resize', [])
  onResize() {
    this.updateLogo()
  }

  updateLogo() {
    this.logoSrc = window.innerWidth < 500 ? 'assets/img/logo-mobile.svg' : 'assets/img/logo.svg'
  }

}
