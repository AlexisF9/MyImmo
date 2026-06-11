import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LikesService {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal<boolean>(false);
  likesList = signal<string[]>([]);

  loadLikes() {
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.likesList.set([]);
      return;
    }

    this.apiService.getAdvertisementsByUser(user.id).subscribe({
      next: (res) => {
        this.likesList.set(res.data.map((ad: any) => ad.documentId));
      },
      error: (err) => console.error('Erreur chargement likes:', err),
    });
  }

  toggleLike(documentId: string) {
    this.authService.getMe().subscribe({
      next: (user) => {
        this.isLoading.set(true);
        const isLiked = this.likesList().includes(documentId);
        const action$ = isLiked
          ? this.apiService.removeAdvertisementFromUser(
              documentId,
              user.documentId,
            )
          : this.apiService.addAdvertisementToUser(documentId, user.documentId);

        action$.subscribe({
          next: () => {
            this.likesList.update((list) =>
              isLiked
                ? list.filter((id) => id !== documentId)
                : [...list, documentId],
            );
            this.isLoading.set(false);
          },
          error: (err) => {
            console.error('Erreur:', JSON.stringify(err.error));
            this.isLoading.set(false);
          },
        });
      },
      error: () => this.router.navigate(['/login']),
    });
  }

  isLiked(documentId: string) {
    return this.likesList().includes(documentId);
  }
}
