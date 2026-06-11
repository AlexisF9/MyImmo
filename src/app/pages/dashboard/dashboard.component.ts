import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Hammer, LogOut, LucideAngularModule, Trash2 } from 'lucide-angular';
import { ButtonComponent } from '../../components/button/button.component';
import { AsyncPipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Announcement } from '../home/home.component';
import { CardComponent } from '../../components/card/card.component';
import { CardsListLoaderComponent } from '../../components/cards-list-loader/cards-list-loader.component';
import { LikesService } from '../../services/likes.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    LucideAngularModule,
    ButtonComponent,
    AsyncPipe,
    CardComponent,
    CardsListLoaderComponent,
  ],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  auth = inject(AuthService);
  api = inject(ApiService);
  likesService = inject(LikesService);

  readonly LogoutIcon = LogOut;
  readonly HammerIcon = Hammer;
  readonly Trash = Trash2;

  loading: boolean = true;
  loadingRemoveAllLikes: boolean = false;
  likes: Announcement[] = [];

  ngOnInit() {
    this.auth.getMe().subscribe({
      next: (user) =>
        this.api.getAdvertisementsByUser(user.id).subscribe({
          next: (res) => {
            this.likes = res.data;
            this.loading = false;
          },
          error: (err) => {
            console.error('Erreur chargement likes:', err);
            this.loading = false;
          },
        }),
    });
  }

  logout() {
    this.auth.logout();
  }

  removeAll() {
    this.loadingRemoveAllLikes = true;
    this.auth.getMe().subscribe({
      next: (user) =>
        this.api
          .removeAllAdvertisementsFromUser(user.id, user.documentId)
          .subscribe({
            next: () => {
              this.likes = [];
              this.likesService.likesList.set([]);
              this.loadingRemoveAllLikes = false;
            },
            error: (err) => {
              console.error('Erreur:', err);
              this.loadingRemoveAllLikes = false;
            },
          }),
    });
  }
}
