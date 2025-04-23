import { Component, Input, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
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
export class VideoPlayerComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef;
  @Input() videoUrl: string = '';
  @Input() poster: string = '';
  @Input() videoSources: VideoSource[] = [];
  
  player: any;
  currentQuality: string = '720p';
  isPlayerInitialized: boolean = false;
  
  constructor() {}
  
  ngOnInit(): void {
    
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes['videoSources']) {
      if (this.isPlayerInitialized && changes['videoSources'].currentValue) {
        
        if (this.videoSources.length > 0) {
          this.player.src({
            src: this.videoSources[0].src,
            type: this.videoSources[0].type
          });
          
          if (this.videoSources.length > 1) {
            this.setupQualitySelector();
          }
        }
      }
    }
  }
  
  ngAfterViewInit(): void {
    this.initializePlayer();
  }
  
  initializePlayer(): void {
    if (!this.videoElement || !this.videoElement.nativeElement) {
      console.error('Video element not found!');
      return;
    }
    
    
    let initialSource = this.videoUrl ? [{ src: this.videoUrl, type: 'video/mp4' }] : undefined;
    
    if (this.videoSources && this.videoSources.length > 0) {
      initialSource = [this.videoSources[0]];
    } else {
      console.warn('No video sources available, using fallback videoUrl:', this.videoUrl);
    }
    
    const playerOptions = {
      controls: true,
      autoplay: false,
      preload: 'auto',
      fluid: true,
      poster: this.poster,
      sources: initialSource,
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

    
    try {
      this.player = videojs(this.videoElement.nativeElement, playerOptions);
      
      this.player.ready(() => {
        this.isPlayerInitialized = true;
        
        if (this.videoSources && this.videoSources.length > 1) {
          this.setupQualitySelector();
        } else {
          console.warn('Only one source available, not setting up quality selector');
        }
      });
      
      this.player.on('error', (error: any) => {
        console.error('Video.js player error:', error);
      });
      
    } catch (error) {
      console.error('Error initializing Video.js player:', error);
    }
  }
  
  setupQualitySelector(): void {
    if (!this.player) {
      console.error('Player not initialized, cannot set up quality selector');
      return;
    }
    
    
    const existingSelector = document.querySelector('.vjs-quality-selector');
    if (existingSelector) {
      existingSelector.remove();
    }
    
    try {
      const qualityContainer = document.createElement('div');
      qualityContainer.className = 'vjs-quality-selector vjs-menu-button vjs-menu-button-popup vjs-control vjs-button';
      
      const qualityButton = document.createElement('button');
      qualityButton.className = 'vjs-menu-button vjs-menu-button-popup vjs-button';
      qualityButton.type = 'button';
      qualityButton.title = 'Quality';
      qualityButton.setAttribute('aria-haspopup', 'true');
      qualityButton.setAttribute('aria-expanded', 'false');
      
      const qualityLabel = document.createElement('span');
      qualityLabel.className = 'vjs-quality-selector-label';
      qualityLabel.textContent = this.currentQuality;
      qualityButton.appendChild(qualityLabel);
      
      const qualityMenu = document.createElement('div');
      qualityMenu.className = 'vjs-menu';
      
      const qualityMenuContent = document.createElement('ul');
      qualityMenuContent.className = 'vjs-menu-content';
      
      this.videoSources.forEach(source => {
        if (source.quality) {
          
          const menuItem = document.createElement('li');
          menuItem.className = 'vjs-menu-item';
          menuItem.textContent = source.label || source.quality;
          menuItem.setAttribute('data-quality', source.quality);
          
          if (source.quality === this.currentQuality) {
            menuItem.classList.add('vjs-selected');
          }
          
          menuItem.addEventListener('click', () => {
            this.changeQuality(source);
          });
          
          qualityMenuContent.appendChild(menuItem);
        }
      });
      
      qualityMenu.appendChild(qualityMenuContent);
      qualityContainer.appendChild(qualityButton);
      qualityContainer.appendChild(qualityMenu);
      
      const controlBar = this.player.controlBar.el();
      
      const fullscreenToggle = controlBar.querySelector('.vjs-fullscreen-control');
      if (fullscreenToggle) {
        controlBar.insertBefore(qualityContainer, fullscreenToggle);
      } else {
        controlBar.appendChild(qualityContainer);
      }
      
    } catch (error) {
      console.error('Error setting up quality selector:', error);
    }
  }
  
  changeQuality(source: VideoSource): void {
    if (!this.player) {
      console.error('Player not initialized, cannot change quality');
      return;
    }
    
    
    const currentTime = this.player.currentTime();
    const wasPlaying = !this.player.paused();
    
    this.currentQuality = source.quality || 'default';
    
    this.player.src({
      src: source.src,
      type: source.type
    });
    
    this.player.ready(() => {
      
      this.player.currentTime(currentTime);
      if (wasPlaying) {
        this.player.play();
      }
      
      const qualityItems = document.querySelectorAll('.vjs-quality-selector .vjs-menu-item');
      qualityItems.forEach(item => {
        item.classList.remove('vjs-selected');
        if (item.getAttribute('data-quality') === this.currentQuality) {
          item.classList.add('vjs-selected');
        }
      });
      
      const qualityLabel = document.querySelector('.vjs-quality-selector-label');
      if (qualityLabel) {
        qualityLabel.textContent = this.currentQuality;
      }
      
    });
  }
  
  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }
}