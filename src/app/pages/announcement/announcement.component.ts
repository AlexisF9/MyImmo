import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Announcement } from '../home/home.component';

@Component({
  selector: 'app-announcement',
  imports: [],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss'
})
export class AnnouncementComponent {
  data: Announcement | null = null;
  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.apiService.getAnnouncementById(parseInt(id)).subscribe({
        next: (res) => {
          this.data = res.data[0]
        },
        error: (err) => {
          console.error('Erreur API:', err)
        }
      });
    }
  }
}
