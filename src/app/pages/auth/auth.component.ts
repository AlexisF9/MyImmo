import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CircleAlertIcon, LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    ButtonComponent,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  readonly CircleAlertIcon = CircleAlertIcon;

  private auth = inject(AuthService);
  private router = inject(Router);

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
    this.auth
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
    this.auth
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
}
