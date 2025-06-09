import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Announcement } from '../home/home.component';
import { PicturesComponent } from '../../components/pictures/pictures.component';
import { BedDouble, DoorClosed, Grid2X2, Hammer, Heart, LucideAngularModule, MapPinned } from 'lucide-angular';
import { LocalStorageServiceService } from '../../services/local-storage-service.service';
import { AnnouncementLoaderComponent } from "../../components/announcement-loader/announcement-loader.component";

@Component({
  selector: 'app-announcement',
  imports: [PicturesComponent, LucideAngularModule, AnnouncementLoaderComponent],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss'
})
export class AnnouncementComponent {
  data: Announcement | null = null
  loading: boolean = false
  ceil = Math.ceil
  likesList: {id: number, time: number}[] = []
  priceFormated: string | null = null
  
  readonly LikeIcon = Heart;
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

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router, private localStorageService: LocalStorageServiceService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadAnnonce(id);
      }
    });

    const storedLikes = this.localStorageService.getItem<{id: number, time: number}[]>("likes");
    this.likesList = storedLikes ?? [];

    this.localStorageService.storageChanges$.subscribe(change => {
      if (change.key === "likes") {
        this.likesList = change.value ?? [];
      }
    });
  }

  loadAnnonce(id: string) {
    this.loading = true
    this.apiService.getAnnouncementById(parseInt(id)).subscribe({
      next: (res) => {
        this.data = res.data[0]
        this.priceFormated = this.formatNumberWithSpaces(res.data[0].price)
        this.loading = false
      },
      error: (err) => {
        console.error('Erreur API:', err)
        this.loading = false
      }
    });
  }

  formatNumberWithSpaces(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  toggleLike(id: number) {
    const index = this.likesList.findIndex(item => item.id === id);
    const date = new Date()
    if (index !== -1) {
      this.likesList.splice(index, 1);
      this.localStorageService.setItem("likes", this.likesList);
    } else {
      this.likesList.push({id, time: date.getTime()});
      this.localStorageService.setItem("likes", this.likesList);
    }
  }

  likeClass(id: number) {
    return this.likesList.find(item => item.id === id)
      ? "fill-red-600 stroke-red-600"
      : "";
  }
} 
