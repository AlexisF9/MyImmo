import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-announcement',
  imports: [],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss'
})
export class AnnouncementComponent {
  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID de l’annonce :', id);

    if (id) {
      this.apiService.getAnnouncementById(parseInt(id)).subscribe({
        next: (res) => {
          console.log(res.data)
        },
        error: (err) => {
          console.error('Erreur API:', err)
        }
      });
    }
  }
}
