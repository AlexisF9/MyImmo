import { Component } from '@angular/core';
import { ButtonComponent } from "../../components/button/button.component";
import { LucideAngularModule, Search } from 'lucide-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [ButtonComponent, LucideAngularModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  readonly SearchIcon = Search

  constructor(private router: Router) {}

  redirectToHome() {
    this.router.navigate(['/']);
  }
}
