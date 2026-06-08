import { Component, computed, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LogOut, LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '../../components/button/button.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [LucideAngularModule, ButtonComponent, AsyncPipe],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  auth = inject(AuthService);
  readonly LogoutIcon = LogOut;

  logout() {
    this.auth.logout();
  }
}
