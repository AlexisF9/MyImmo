import { Component, input } from '@angular/core';
import { ChevronLeft, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-pictures',
  imports: [LucideAngularModule],
  templateUrl: './pictures.component.html',
  styleUrl: './pictures.component.scss'
})
export class PicturesComponent {
  readonly ArrowIcon = ChevronLeft;
  pictures = input.required<{url: string, name: string}[]>()
  zoom: boolean = false

  ngOnInit() {
    console.log(this.pictures())
  }

  toggleZoom() {
    this.zoom = !this.zoom
    document.body.classList.toggle('noscroll');
  }
}
