import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
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
  styleUrl: './video-player.component.scss',
})
export class VideoPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef;
  @Input() videoUrl: string = '';
  @Input() poster: string = '';
  @Input() videoSources: VideoSource[] = [];
  currentQuality: string = 'original';
  player: any;

  constructor() {}

  ngOnInit(): void {
    console.log(
      'VideoPlayerComponent initialized with sources:',
      this.videoSources
    );
  }

  ngAfterViewInit(): void {
    this.initializePlayer();
  }

  initializePlayer(): void {
    // Prüfen, ob wir gültige Videoquellen haben
    if (!this.videoSources || this.videoSources.length === 0) {
      console.warn('No video sources provided!');
      if (this.videoUrl) {
        this.videoSources = [
          {
            src: this.videoUrl,
            type: 'video/mp4',
            label: 'Default',
            quality: 'default',
          },
        ];
      }
    }

    console.log('Initializing player with sources:', this.videoSources);

    // Player initialisieren
    this.player = videojs(this.videoElement.nativeElement, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      fluid: true,
      poster: this.poster,
      sources: this.videoSources.length > 0 ? [this.videoSources[0]] : [],
      controlBar: {
        children: [
          'playToggle',
          'volumePanel',
          'currentTimeDisplay',
          'timeDivider',
          'durationDisplay',
          'progressControl',
          'fullscreenToggle',
        ],
      },
    });

    // Warte, bis der Player bereit ist
    this.player.ready(() => {
      console.log('Player is ready!');

      if (this.videoSources.length > 1) {
        // Direkter Ansatz: Manuelles Hinzufügen des Qualitätsauswahlmenüs
        this.addQualitySelector();
      }
    });
  }

  addQualitySelector(): void {
    console.log('Adding quality selector with sources:', this.videoSources);

    // Sicherstellen, dass der Player existiert
    if (!this.player || !this.player.controlBar) {
      console.error('Player or control bar not initialized');
      return;
    }

    const defaultSource =
      this.videoSources.find((source) => source.quality === 'original') ||
      this.videoSources[0];
    if (defaultSource && defaultSource.quality) {
      this.currentQuality = defaultSource.quality;
    }

    try {
      const controlBar = this.player.controlBar.el();
      console.log('Control bar found:', controlBar);

      // Erstelle ein neues Div für die Qualitätssteuerung
      const qualityContainer = document.createElement('div');
      qualityContainer.className =
        'vjs-quality-dropdown vjs-menu-button vjs-menu-button-popup vjs-control vjs-button';
      qualityContainer.setAttribute('title', 'Quality');

      // Button mit Label erstellen
      const qualityTrigger = document.createElement('button');
      qualityTrigger.className =
        'vjs-menu-button vjs-menu-button-popup vjs-button';
      qualityTrigger.type = 'button';
      qualityTrigger.setAttribute('aria-haspopup', 'true');
      qualityTrigger.setAttribute('aria-expanded', 'false');
      qualityTrigger.innerHTML = `<span>${this.currentQuality}</span>`;

      qualityTrigger.addEventListener('click', (event) => {
        event.stopPropagation(); // Verhindere, dass der Klick den Player beeinflusst

        // Toggle das Menü
        const menu = qualityContainer.querySelector('.vjs-menu');
        if (menu) {
          const isVisible = menu.classList.contains('vjs-lock-showing');
          if (isVisible) {
            menu.classList.remove('vjs-lock-showing');
          } else {
            menu.classList.add('vjs-lock-showing');
          }
        }
      });

      document.addEventListener('click', (event) => {
        const menu = qualityContainer.querySelector('.vjs-menu');
        if (menu && menu.classList.contains('vjs-lock-showing')) {
          menu.classList.remove('vjs-lock-showing');
        }
      });

      // Dropdown-Menü erstellen
      const qualityMenu = document.createElement('div');
      qualityMenu.className = 'vjs-menu';

      qualityMenu.addEventListener('click', (event) => {
        event.stopPropagation();
      });

      const qualityMenuContent = document.createElement('ul');
      qualityMenuContent.className = 'vjs-menu-content';

      // Füge Menüeinträge für jede Qualität hinzu
      this.videoSources.forEach((source) => {
        if (!source.quality) return;

        console.log(`Adding menu item for quality: ${source.quality}`);

        const menuItem = document.createElement('li');
        menuItem.className = `vjs-menu-item ${
          source.quality === '720p' ? 'vjs-selected' : ''
        }`;
        menuItem.setAttribute('data-quality', source.quality || '');
        menuItem.innerHTML = `<span>${source.label || source.quality}</span>`;

        // Klick-Handler hinzufügen
        menuItem.addEventListener('click', () => {
          console.log(`Quality menu item clicked: ${source.quality}`);
          this.changeQuality(source);
          this.currentQuality = source.quality || '';

          const qualityButtonLabel = qualityTrigger.querySelector('span');
          if (qualityButtonLabel) {
            qualityButtonLabel.textContent = this.currentQuality;
          }

          // Update UI
          const qualityItems =
            qualityContainer.querySelectorAll('.vjs-menu-item');
          qualityItems.forEach((item) => {
            item.classList.remove('vjs-selected');
          });
          menuItem.classList.add('vjs-selected');
        });

        qualityMenuContent.appendChild(menuItem);
      });

      // Füge alles zusammen
      qualityMenu.appendChild(qualityMenuContent);
      qualityContainer.appendChild(qualityTrigger);
      qualityContainer.appendChild(qualityMenu);

      // Füge das erstellte Element zur Kontrollleiste hinzu
      // Versuche zuerst, es vor dem Vollbildbutton einzufügen
      const fullscreenButton = controlBar.querySelector(
        '.vjs-fullscreen-control'
      );
      if (fullscreenButton) {
        console.log(
          'Fullscreen button found, inserting quality selector before it'
        );
        controlBar.insertBefore(qualityContainer, fullscreenButton);
      } else {
        // Fallback: am Ende anhängen
        console.log(
          'Fullscreen button not found, appending quality selector to control bar'
        );
        controlBar.appendChild(qualityContainer);
      }

      console.log('Quality selector added successfully');

      // Debug: Überprüfe, ob das Element tatsächlich im DOM ist
      setTimeout(() => {
        const addedSelector = controlBar.querySelector('.vjs-quality-dropdown');
        console.log('Is quality selector in DOM?', !!addedSelector);
        if (addedSelector) {
          console.log('Quality selector element:', addedSelector);
          console.log(
            'Is menu visible on hover?',
            window.getComputedStyle(addedSelector.querySelector('.vjs-menu'))
              .display
          );
        }
      }, 1000);
    } catch (error) {
      console.error('Error adding quality selector:', error);
    }
  }

  changeQuality(source: VideoSource): void {
    if (!this.player) return;

    console.log('Changing quality to:', source);

    // Speichere aktuelle Wiedergabeposition und Status
    const currentTime = this.player.currentTime();
    const wasPlaying = !this.player.paused();

    // Setze neue Quelle
    this.player.src({
      src: source.src,
      type: source.type,
    });

    // Stelle Position und Wiedergabestatus wieder her
    this.player.one('loadedmetadata', () => {
      this.player.currentTime(currentTime);

      if (wasPlaying) {
        this.player.play();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }
  }
}
