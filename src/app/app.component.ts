import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service';
import { LikesService } from './services/likes.service';
import { LoginPopupComponent } from './components/login-popup/login-popup.component';
import { ModalService } from './services/modal.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HttpClientModule,
    HeaderComponent,
    FooterComponent,
    LoginPopupComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private likesService = inject(LikesService);
  modalService = inject(ModalService);

  constructor(public auth: AuthService) {}

  ngOnInit() {
    let likesLoaded = false;

    this.auth.currentUser$.subscribe((user) => {
      if (user) {
        if (!likesLoaded) {
          this.likesService.loadLikes();
          likesLoaded = true;
        }
        this.modalService.close();
      } else {
        this.likesService.likesList.set([]);
        likesLoaded = false;
      }
    });

    if (this.auth.isLoggedIn()) {
      this.auth.getMe().subscribe();
    }
  }
}
