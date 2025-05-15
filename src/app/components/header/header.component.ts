import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { ButtonComponent } from "../button/button.component";
import { Heart, LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../services/api.service';
import { LoaderComponent } from '../loader/loader.component';
import { Announcement } from '../../pages/home/home.component';
import { CardComponent } from "../card/card.component";
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, ButtonComponent, LucideAngularModule, LoaderComponent, CardComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly HeartIcon = Heart

  data: Announcement[] | null = null
  openLikesList: boolean = false
  loading: boolean = false

  constructor(private apiService: ApiService, private router: Router) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.close()
      });
  }

  open() {
    const likes = JSON.parse(localStorage.getItem("likes") as string)

    this.openLikesList = true
    this.loading = true
    document.body.classList.add('noscroll');

    this.apiService.getAnnouncementByIds(likes).subscribe({
      next: (res) => {
        this.data = res.data
        this.loading = false
      },
      error: (err) => {
        console.error('Erreur API:', err)
        this.loading = false
      }
    });
  }

  close() {
    this.openLikesList = false
    this.loading = false
    document.body.classList.remove('noscroll');
  }

  update() {
    const likes = JSON.parse(localStorage.getItem("likes") as string)
    this.apiService.getAnnouncementByIds(likes).subscribe({
      next: (res) => {
        this.data = res.data
        this.loading = false
      },
      error: (err) => {
        console.error('Erreur API:', err)
        this.loading = false
      }
    });
  }
}
