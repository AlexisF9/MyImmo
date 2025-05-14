import { Component, input } from '@angular/core';
import { Announcement } from '../../pages/home/home.component';
import { RouterLink } from '@angular/router';
import { Heart, LucideAngularModule } from 'lucide-angular';

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
  likesList: number[] = []

  ngOnInit() {
    if (localStorage.getItem("likes")) {
      this.likesList = JSON.parse(localStorage.getItem("likes") as string)
    }
  }

  toggleLike(id: number) {
    if (this.likesList.find((el) => el === id)) {
      const index = this.likesList.indexOf(id)
      this.likesList.splice(index, 1)
      localStorage.setItem("likes", JSON.stringify(this.likesList))
    } else {
      this.likesList.push(id)
      localStorage.setItem("likes", JSON.stringify(this.likesList))
    }
  }

  likeClass(id: number) {
    if (this.likesList.find((el) => el === id)) {
      return "fill-red-600 stroke-red-600"
    }
    return;
  }
}
