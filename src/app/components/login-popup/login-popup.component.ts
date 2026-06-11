import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { CircleAlertIcon, LucideAngularModule, X } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-login-popup',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    LucideAngularModule,
  ],
  templateUrl: './login-popup.component.html',
  styleUrl: './login-popup.component.scss',
})
export class LoginPopupComponent {
  private modalService = inject(ModalService);

  readonly CloseIcon = X;

  constructor(
    private router: Router,
    public authService: AuthService,
  ) {}

  readonly CircleAlertIcon = CircleAlertIcon;

  tab = signal<'login' | 'register'>('login');
  loading = signal(false);
  error = signal('');

  authForm = new FormGroup({
    email: new FormControl<string | null>(null, [Validators.required]),
    password: new FormControl<string | null>(null, [Validators.required]),
    username: new FormControl<string | null>(null, [Validators.required]),
  });

  switchTab(t: 'login' | 'register') {
    this.tab.set(t);
    this.error.set('');
    this.authForm.value.email = '';
    this.authForm.value.password = '';
    this.authForm.value.username = '';
  }

  login() {
    if (!this.authForm.value.email || !this.authForm.value.password) {
      this.error.set('Veuillez remplir tous les champs');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.authService
      .login(this.authForm.value.email, this.authForm.value.password)
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (e) => {
          this.error.set('Identifiants incorrects');
          this.loading.set(false);
        },
      });
  }

  register() {
    if (
      !this.authForm.value.username ||
      !this.authForm.value.email ||
      !this.authForm.value.password
    ) {
      this.error.set('Veuillez remplir tous les champs');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.authService
      .register(
        this.authForm.value.username,
        this.authForm.value.email,
        this.authForm.value.password,
      )
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (e) => {
          this.error.set("Erreur lors de l'inscription");
          this.loading.set(false);
        },
      });
  }

  closeModal() {
    this.modalService.close();
  }
}
