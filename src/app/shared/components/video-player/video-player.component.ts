import { Component, Input, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import videojs from 'video.js';

interface VideoSource {
  src: string;
  type: string;
  label?: string;
  quality?: string;
}

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef;
  @Input() videoUrl: string = '';
  @Input() poster: string = '';
  @Input() videoSources: VideoSource[] = [];
  
  player: any;
  currentQuality: string = '720p';
  
  constructor() {}
  
  ngOnInit(): void {
    console.log('VideoPlayerComponent initialized with sources:', this.videoSources);
    
    // Wenn keine Quellen angegeben wurden, aber eine videoUrl existiert, erstelle eine Standardquelle
    if (this.videoSources.length === 0 && this.videoUrl) {
      this.videoSources = [{
        src: this.videoUrl,
        type: 'video/mp4',
        label: 'Default',
        quality: 'default'
      }];
    }
    
    // Überprüfe, ob mehrere Quellen vorhanden sind
    if (this.videoSources.length > 1) {
      console.log('Multiple video sources available. Quality selector should be visible.');
    } else {
      console.log('Only one video source. Quality selector will not be displayed.');
    }
  }
  
  ngAfterViewInit(): void {
    this.initializePlayer();
  }
  
  initializePlayer(): void {
    // Standardkonfiguration für den Player
    const playerOptions = {
      controls: true,
      autoplay: false,
      preload: 'auto',
      fluid: true,
      poster: this.poster,
      sources: [this.videoSources[0]], // Starte mit der ersten Quelle
      controlBar: {
        children: [
          'playToggle',
          'volumePanel',
          'currentTimeDisplay',
          'timeDivider',
          'durationDisplay',
          'progressControl',
          'fullscreenToggle'
        ]
      }
    };

    // Player initialisieren
    this.player = videojs(this.videoElement.nativeElement, playerOptions);
    
    // Warten, bis der Player bereit ist
    this.player.ready(() => {
      console.log('Player is ready. Setting up quality selector...');
      
      // Quality Selector nur hinzufügen, wenn mehrere Quellen vorhanden sind
      if (this.videoSources.length > 1) {
        this.addQualitySelector();
      }
    });
  }
  
  addQualitySelector(): void {
    // Qualitätsauswahl zum Player hinzufügen
    console.log('Adding quality selector to player...');
    
    // Erstelle ein Container-Element für die Qualitätsauswahl
    const qualityContainer = document.createElement('div');
    qualityContainer.className = 'vjs-quality-selector vjs-menu-button vjs-menu-button-popup vjs-control vjs-button';
    
    // Erstelle den Button
    const qualityButton = document.createElement('button');
    qualityButton.className = 'vjs-menu-button vjs-menu-button-popup vjs-button';
    qualityButton.type = 'button';
    qualityButton.setAttribute('aria-haspopup', 'true');
    qualityButton.setAttribute('aria-expanded', 'false');
    qualityButton.title = 'Quality';
    
    // Erstelle das Span für die aktuelle Qualitätsstufe
    const qualityLabel = document.createElement('span');
    qualityLabel.className = 'vjs-quality-selector-label';
    qualityLabel.textContent = this.currentQuality;
    qualityButton.appendChild(qualityLabel);
    
    // Erstelle das Dropdown-Menü
    const qualityMenu = document.createElement('div');
    qualityMenu.className = 'vjs-menu';
    
    const qualityMenuContent = document.createElement('ul');
    qualityMenuContent.className = 'vjs-menu-content';
    
    // Füge für jede Qualität einen Menüeintrag hinzu
    this.videoSources.forEach(source => {
      if (source.quality) {
        const menuItem = document.createElement('li');
        menuItem.className = 'vjs-menu-item';
        
        // Markiere die aktuelle Qualität
        if (source.quality === this.currentQuality) {
          menuItem.classList.add('vjs-selected');
        }
        
        // Text und Daten des Menüeintrags
        menuItem.textContent = source.label || source.quality;
        menuItem.setAttribute('data-quality', source.quality);
        
        // Klick-Handler
        menuItem.addEventListener('click', () => {
          this.switchQuality(source);
        });
        
        qualityMenuContent.appendChild(menuItem);
      }
    });
    
    // Füge alles zusammen
    qualityMenu.appendChild(qualityMenuContent);
    qualityContainer.appendChild(qualityButton);
    qualityContainer.appendChild(qualityMenu);
    
    // Füge die Qualitätsauswahl zur Player-Control-Bar hinzu
    if (this.player && this.player.controlBar) {
      const controlBar = this.player.controlBar.el();
      
      // Füge es vor dem Vollbildbutton ein
      const fullscreenToggle = controlBar.querySelector('.vjs-fullscreen-control');
      if (fullscreenToggle) {
        controlBar.insertBefore(qualityContainer, fullscreenToggle);
        console.log('Quality selector added successfully.');
      } else {
        // Fallback: Ans Ende der Control-Bar anfügen
        controlBar.appendChild(qualityContainer);
        console.log('Quality selector added at the end of control bar.');
      }
    } else {
      console.error('Control bar not found!');
    }
  }
  
  switchQuality(source: VideoSource): void {
    if (!this.player) return;
    
    console.log('Switching quality to:', source.quality);
    
    // Aktuelle Zeit und Wiedergabestatus merken
    const currentTime = this.player.currentTime();
    const isPaused = this.player.paused();
    
    // Qualität aktualisieren
    this.currentQuality = source.quality || 'default';
    
    // Quelle wechseln
    this.player.src({
      src: source.src,
      type: source.type
    });
    
    // Videostatus wiederherstellen
    this.player.ready(() => {
      this.player.currentTime(currentTime);
      if (!isPaused) {
        this.player.play();
      }
      
      // UI aktualisieren
      const qualityItems = document.querySelectorAll('.vjs-quality-selector .vjs-menu-item');
      qualityItems.forEach(item => {
        item.classList.remove('vjs-selected');
        if (item.getAttribute('data-quality') === this.currentQuality) {
          item.classList.add('vjs-selected');
        }
      });
      
      // Label aktualisieren
      const qualityLabel = document.querySelector('.vjs-quality-selector-label');
      if (qualityLabel) {
        qualityLabel.textContent = this.currentQuality;
      }
      
      console.log('Quality switched successfully.');
    });
  }
  
  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }
}