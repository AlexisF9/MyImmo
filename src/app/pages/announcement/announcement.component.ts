import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Announcement } from '../home/home.component';
import { PicturesComponent } from '../../components/pictures/pictures.component';
import {
  BedDouble,
  DoorClosed,
  Grid2X2,
  Hammer,
  Heart,
  LucideAngularModule,
  MapPinned,
} from 'lucide-angular';
import { AnnouncementLoaderComponent } from '../../components/announcement-loader/announcement-loader.component';
import { LikesService } from '../../services/likes.service';

@Component({
  selector: 'app-announcement',
  imports: [
    PicturesComponent,
    LucideAngularModule,
    AnnouncementLoaderComponent,
  ],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss',
})
export class AnnouncementComponent {
  data: Announcement | null = null;
  loading: boolean = false;
  ceil = Math.ceil;
  likesList: string[] = [];
  priceFormated: string | null = null;

  readonly LikeIcon = Heart;
  readonly DoorIcon = DoorClosed;
  readonly BedIcon = BedDouble;
  readonly SurfaceIcon = Grid2X2;
  readonly MapIcon = MapPinned;
  readonly HammerIcon = Hammer;

  dpeList = [
    {
      letter: 'A',
      color: 'bg-dpe-a',
    },
    {
      letter: 'B',
      color: 'bg-dpe-b',
    },
    {
      letter: 'C',
      color: 'bg-dpe-c',
    },
    {
      letter: 'D',
      color: 'bg-dpe-d',
    },
    {
      letter: 'E',
      color: 'bg-dpe-e',
    },
    {
      letter: 'F',
      color: 'bg-dpe-f',
    },
    {
      letter: 'G',
      color: 'bg-dpe-g',
    },
  ];

  gesList = [
    {
      letter: 'A',
      color: 'bg-ges-a',
    },
    {
      letter: 'B',
      color: 'bg-ges-b',
    },
    {
      letter: 'C',
      color: 'bg-ges-c',
    },
    {
      letter: 'D',
      color: 'bg-ges-d',
    },
    {
      letter: 'E',
      color: 'bg-ges-e',
    },
    {
      letter: 'F',
      color: 'bg-ges-f',
    },
    {
      letter: 'G',
      color: 'bg-ges-g',
    },
  ];

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private likesService: LikesService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const documentId = params.get('documentId');
      if (documentId) this.loadAnnonce(documentId);
    });
  }

  loadAnnonce(documentId: string) {
    this.loading = true;
    this.apiService.getAnnouncementByDocumentId(documentId).subscribe({
      next: (res) => {
        this.data = res.data;
        this.priceFormated = this.formatNumberWithSpaces(res.data.price);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.loading = false;
      },
    });
  }

  formatNumberWithSpaces(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  toggleLike(documentId: string) {
    this.likesService.toggleLike(documentId);
  }

  likeClass(documentId: string) {
    return this.likesService.isLiked(documentId)
      ? 'fill-red-600 stroke-red-600'
      : '';
  }
}
