import { Component, ElementRef, input, Renderer2, ViewChild } from '@angular/core';
import { Camera, ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';
import KeenSlider, { KeenSliderInstance } from "keen-slider"

@Component({
  selector: 'app-pictures',
  imports: [LucideAngularModule],
  templateUrl: './pictures.component.html',
  styleUrl: './pictures.component.scss'
})
export class PicturesComponent {
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;
  readonly CameraIcon = Camera;
  pictures = input.required<{url: string, name: string}[]>()
  zoom: boolean = false
  
  screenWidth!: number;
  isMobile!: boolean;
  resizeListener!: () => void;

  constructor(private renderer: Renderer2) {}

  @ViewChild("sliderRef") sliderRef!: ElementRef<HTMLElement>

  currentSlide: number = 0
  slider: KeenSliderInstance | null = null

  ngOnInit() {
    this.updateDeviceMode();

    this.resizeListener = this.renderer.listen('window', 'resize', () => {
      const wasMobile = this.isMobile;
      this.updateDeviceMode();

      // detection changement de mode mobile ↔ desktop
      if (wasMobile !== this.isMobile) {
        // on attent un tour d'evenement en plus
        setTimeout(() => {
          if (this.isMobile) {
            this.initSlider();
          } else {
            this.destroySlider();
          }
        });
      }
    });
  }

  ngAfterViewInit() {
    if (this.isMobile) {
      this.initSlider();
    }
  }

  ngOnDestroy() {
    if (this.slider) {
      this.slider.destroy()
    }

    if (this.resizeListener) {
      this.resizeListener();
    }
  }

  toggleZoom() {
    this.zoom = !this.zoom
    document.body.classList.toggle('noscroll');
  }

  private updateDeviceMode() {
    this.screenWidth = window.innerWidth;
    this.isMobile = this.screenWidth <= 768;
  }

  private initSlider() {
    if (this.sliderRef && !this.slider) {
      this.slider = new KeenSlider(this.sliderRef.nativeElement, {
        initial: this.currentSlide,
        slideChanged: (s) => {
          this.currentSlide = s.track.details.rel;
        },
      });
    }
  }

  private destroySlider() {
    if (this.slider) {
      this.slider.destroy();
      this.slider = null;
    }
  }
}
