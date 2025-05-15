import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { ButtonComponent } from "../button/button.component";
import { Heart, LucideAngularModule, X } from 'lucide-angular';
import { ApiService } from '../../services/api.service';
import { LoaderComponent } from '../loader/loader.component';
import { Announcement } from '../../pages/home/home.component';
import { CardComponent } from "../card/card.component";
import { filter } from 'rxjs';
import { LocalStorageServiceService } from '../../services/local-storage-service.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, ButtonComponent, LucideAngularModule, LoaderComponent, CardComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly HeartIcon = Heart
  readonly CloseIcon = X

  data: Announcement[] | null = null
  openLikesList: boolean = false
  loading: boolean = false
  likesList: number[] = []

  constructor(private apiService: ApiService, private router: Router, private localStorageService: LocalStorageServiceService) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.close()
      });
  }

  open() {
    this.openLikesList = true
    document.body.classList.add('noscroll');

    if (!this.arraysAreEqual(this.likesList, this.localStorageService.getItem<number[]>("likes") ?? [])) {
      const storedLikes = this.localStorageService.getItem<number[]>("likes");
      this.likesList = storedLikes ?? [];
      
      if (this.likesList.length > 0) {
        this.loading = true

        this.apiService.getAnnouncementByIds(this.likesList).subscribe({
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
    
  }

  arraysAreEqual(arr1: number[], arr2: number[]) {
    if (arr1.length !== arr2.length) return false;

    return arr1.every((val, index) => val === arr2[index]);
  }

  close() {
    this.openLikesList = false
    this.loading = false
    document.body.classList.remove('noscroll');
  }

  update() {
    const storedLikes = this.localStorageService.getItem<number[]>("likes");
    this.likesList = storedLikes ?? [];

    if (this.likesList.length > 0) {
      this.apiService.getAnnouncementByIds(this.likesList).subscribe({
        next: (res) => {
          this.data = res.data
          this.loading = false
        },
        error: (err) => {
          console.error('Erreur API:', err)
          this.loading = false
        }
      });
    } else {
      this.data = null
    }
  }
}
