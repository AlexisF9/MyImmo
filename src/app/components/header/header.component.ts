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
  likesList: {id: number, time: number}[] = []

  constructor(private apiService: ApiService, private router: Router, private localStorageService: LocalStorageServiceService) {
    // close les likes si on change la page
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.close()
      });
  }

  sortAdsByTimeOrder(timeArr: {id: number, time: number}[], ads: Announcement[]): Announcement[] {
    // Étape 1 : trier timeArr par time décroissant
    const sortedIds = timeArr
      .slice()
      .sort((a, b) => b.time - a.time)
      .map(item => item.id);

    // Étape 2 : créer un map pour accès rapide aux annonces par id
    const adMap = new Map<number, Announcement>(ads.map(ad => [ad.id, ad]));

    // Étape 3 : réordonner les annonces selon l’ordre des ids triés
    return sortedIds
      .map(id => adMap.get(id))
      .filter((ad): ad is Announcement => ad !== undefined); // filtre les id non trouvés
  }

  open() {
    this.openLikesList = true
    document.body.classList.add('noscroll');

    if (!this.arraysAreEqual(this.likesList, this.localStorageService.getItem<{id: number, time: number}[]>("likes") ?? [])) {
      const storedLikes = this.localStorageService.getItem<{id: number, time: number}[]>("likes");
      this.likesList = storedLikes ?? [];
      
      this.getApiService(true)
    } else {
      this.update();
    }    
  }

  arraysAreEqual(arr1: {id: number, time: number}[], arr2: {id: number, time: number}[]) {
    if (arr1.length !== arr2.length) return false;

    return arr1.every((val, index) => val === arr2[index]);
  }

  close() {
    this.openLikesList = false
    this.loading = false
    document.body.classList.remove('noscroll');
  }

  update() {
    const storedLikes = this.localStorageService.getItem<{id: number, time: number}[]>("likes");
    this.likesList = storedLikes ?? [];

    this.getApiService()
  }

  getApiService(loader?: boolean) {
    if (this.likesList.length > 0) {
      this.loading = loader ? true : false

      this.apiService.getAnnouncementByIds(this.likesList).subscribe({
        next: (res) => {
          this.data = this.sortAdsByTimeOrder(this.likesList, res.data)
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
