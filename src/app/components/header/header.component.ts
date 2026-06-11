import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import {
  Heart,
  House,
  LogInIcon,
  LucideAngularModule,
  Trash2,
  X,
} from 'lucide-angular';
import { Announcement } from '../../pages/home/home.component';
import { AuthService } from '../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPopupComponent } from '../login-popup/login-popup.component';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-header',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    LucideAngularModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private modalService = inject(ModalService);

  readonly HeartIcon = Heart;
  readonly CloseIcon = X;
  readonly LogInIcon = LogInIcon;
  readonly HouseIcon = House;

  data: Announcement[] | null = null;
  openLikesList: boolean = false;
  likesList: { id: number; time: number }[] = [];

  constructor(
    private router: Router,
    public authService: AuthService,
  ) {}

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  openModal() {
    this.modalService.open();
  }
}
