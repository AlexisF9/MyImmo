import { Component, input, output } from '@angular/core';
import { Announcement } from '../../pages/home/home.component';
import { RouterLink } from '@angular/router';
import { Heart, LucideAngularModule } from 'lucide-angular';
import { LocalStorageServiceService } from '../../services/local-storage-service.service';

@Component({
  selector: 'app-card',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  announcement = input.required<Announcement>()
  ceil = Math.ceil
  readonly HeartIcon = Heart
  likesList: {id: number, time: number}[] = []
  dislike = output<void>()
  priceFormated: string | null = null

  constructor(private localStorageService: LocalStorageServiceService) {}

  ngOnInit() {
    // Init des likes depuis le localStorage
    const storedLikes = this.localStorageService.getItem<{id: number, time: number}[]>("likes");
    this.likesList = storedLikes ?? [];
    this.priceFormated = this.formatNumberWithSpaces(this.announcement().price)

    // Écoute des changements
    this.localStorageService.storageChanges$.subscribe(change => {
      if (change.key === "likes") {
        this.likesList = change.value ?? [];
      }
    });
  }

  formatNumberWithSpaces(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  toggleLike(id: number) {
    const index = this.likesList.findIndex(item => item.id === id);
    const date = new Date()
    if (index !== -1) {
      this.likesList.splice(index, 1);
      this.localStorageService.setItem("likes", this.likesList);
      this.dislike.emit();
    } else {
      this.likesList.push({id, time: date.getTime()});
      this.localStorageService.setItem("likes", this.likesList);
    }
  }

  likeClass(id: number) {
    return this.likesList.find(item => item.id === id)
      ? "fill-red-600 stroke-red-600"
      : "";
  }
}
