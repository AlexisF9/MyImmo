import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Announcement } from '../home/home.component';
import { LoaderComponent } from "../../components/loader/loader.component";
import { PicturesComponent } from '../../components/pictures/pictures.component';
import { BedDouble, DoorClosed, Grid2X2, Hammer, LucideAngularModule, MapPinned } from 'lucide-angular';

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
  readonly MapIcon = MapPinned;
  readonly HammerIcon = Hammer;

  dpeList = [
    {
      letter: "A",
      color: "bg-dpe-a"
    },
    {
      letter: "B",
      color: "bg-dpe-b"
    },
    {
      letter: "C",
      color: "bg-dpe-c"
    },
    {
      letter: "D",
      color: "bg-dpe-d"
    },
    {
      letter: "E",
      color: "bg-dpe-e"
    },
    {
      letter: "F",
      color: "bg-dpe-f"
    },
    {
      letter: "G",
      color: "bg-dpe-g"
    }
  ]

  gesList = [
    {
      letter: "A",
      color: "bg-ges-a"
    },
    {
      letter: "B",
      color: "bg-ges-b"
    },
    {
      letter: "C",
      color: "bg-ges-c"
    },
    {
      letter: "D",
      color: "bg-ges-d"
    },
    {
      letter: "E",
      color: "bg-ges-e"
    },
    {
      letter: "F",
      color: "bg-ges-f"
    },
    {
      letter: "G",
      color: "bg-ges-g"
    }
  ]

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadAnnonce(id);
      }
    });
  }

  loadAnnonce(id: string) {
    this.loading = true
    this.apiService.getAnnouncementById(parseInt(id)).subscribe({
      next: (res) => {
        this.data = res.data[0]
        this.loading = false
      },
      error: (err) => {
        console.error('Erreur API:', err)
        this.loading = false
      }
    });
  }
} 
