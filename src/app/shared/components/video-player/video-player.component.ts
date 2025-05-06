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
import { VideoService } from '../../../services/video-service/video.service';

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
  @Input() requestFullscreen: boolean = false;
  currentQuality: string = 'original';
  player: any;

  constructor(
    private videoService: VideoService,
  ) {}

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.initializePlayer();
    this.videoService.isPlaying = true

    if (this.requestFullscreen) {
      setTimeout(() => {
        this.tryEnterFullscreen();
      }, 500);
    }
  }

  tryEnterFullscreen(): void {
    if (this.player && this.player.isReady_) {
      try {
        if (this.player.requestFullscreen) {
          this.player.requestFullscreen();
        } 
        else if (this.player.el_ && this.player.el_.requestFullscreen) {
          this.player.el_.requestFullscreen();
        }
        else if (this.videoElement.nativeElement.requestFullscreen) {
          this.videoElement.nativeElement.requestFullscreen();
        }
      } catch (err) {
        console.error('Fullscreen request failed:', err);
      }
    }
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

      if (this.videoSources.length > 1) {
        this.addQualitySelector();
      }
    });
  }

  addQualitySelector(): void {
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


        const menuItem = document.createElement('li');
        menuItem.className = `vjs-menu-item ${
          source.quality === '720p' ? 'vjs-selected' : ''
        }`;
        menuItem.setAttribute('data-quality', source.quality || '');
        menuItem.innerHTML = `<span>${source.label || source.quality}</span>`;

        // Klick-Handler hinzufügen
        menuItem.addEventListener('click', () => {
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
        controlBar.insertBefore(qualityContainer, fullscreenButton);
      } else {
        controlBar.appendChild(qualityContainer);
      }    
    } catch (error) {
      console.error('Error adding quality selector:', error);
    }
  }

  changeQuality(source: VideoSource): void {
    if (!this.player) return;

    const currentTime = this.player.currentTime();
    const wasPlaying = !this.player.paused();

    this.player.src({
      src: source.src,
      type: source.type,
    });

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
