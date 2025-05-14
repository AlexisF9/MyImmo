import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Announcement } from '../home/home.component';
import { LoaderComponent } from "../../components/loader/loader.component";
import { PicturesComponent } from '../../components/pictures/pictures.component';
import { BedDouble, DoorClosed, Grid2X2, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-announcement',
  imports: [LoaderComponent, PicturesComponent, LucideAngularModule],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss'
})
export class AnnouncementComponent {
  data: Announcement | null = null
  loading: boolean = false
  ceil = Math.ceil
  readonly DoorIcon = DoorClosed;
  readonly BedIcon = BedDouble;
  readonly SurfaceIcon = Grid2X2;

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.loading = true

    if (id) {
      this.apiService.getAnnouncementById(parseInt(id)).subscribe({
        next: (res) => {
          this.data = res.data[0]
          console.log(this.data)
          this.loading = false
        },
        error: (err) => {
          console.error('Erreur API:', err)
          this.loading = false
        }
      });
    }
  }
}
