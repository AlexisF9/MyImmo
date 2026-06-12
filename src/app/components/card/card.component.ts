import { Component, input, output, computed, inject } from '@angular/core';
import { Announcement } from '../../pages/home/home.component';
import { RouterLink } from '@angular/router';
import { Heart, LucideAngularModule } from 'lucide-angular';
import { LikesService } from '../../services/likes.service';

@Component({
  selector: 'app-card',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  likesService = inject(LikesService);
  announcement = input.required<Announcement>();
  ceil = Math.ceil;
  readonly HeartIcon = Heart;
  dislike = output<void>();
  priceFormated: string | null = null;

  isLiked = computed(() =>
    this.likesService.likesList().includes(this.announcement().documentId),
  );

  ngOnInit() {
    this.priceFormated = this.formatNumberWithSpaces(this.announcement().price);
  }

  formatNumberWithSpaces(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  toggleLike(documentId: string) {
    this.likesService.toggleLike(documentId);
  }

  likeClass() {
    return this.isLiked() ? 'fill-red-600 stroke-red-600' : '';
  }
}
