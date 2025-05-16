import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CardsListComponent } from "../../components/cards-list/cards-list.component";
import { SearchComponent } from "../../components/search/search.component";
import { Router } from '@angular/router';
import { ButtonComponent } from "../../components/button/button.component";

export interface Announcement {
  id: number,
  name: string,
  description: string,
  price: number,
  surface: number,
  pieces: number,
  rooms: number,
  address: {
    city: string,
    postale_code: string
  },
  pictures: {
    id: number,
    name: string,
    url: string
  }[],
  distribution_type: {
    name: string
  },
  category: {
    name: string
  },
  characteristics: {
    name: string
  }[],
  energy_performance: {
    letter: string
  },
  gaz_performance: {
    letter: string
  },
  construction_year: string
}

@Component({
  selector: 'app-home',
  imports: [CardsListComponent, SearchComponent, ButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  filteredBuyData: Announcement[] | null = null
  filteredRentData: Announcement[] | null = null

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getAnnouncements('Grenoble', 'Acheter', '', 0, undefined, 0, undefined, 3).subscribe({
      next: (res) => {
        this.filteredBuyData = res.data
      },
      error: (err) => {
        console.error('Erreur API:', err)
      }
    });

    this.apiService.getAnnouncements('Grenoble', 'Louer', '', 0, undefined, 0, undefined, 3).subscribe({
      next: (res) => {
        this.filteredRentData = res.data
      },
      error: (err) => {
        console.error('Erreur API:', err)
      }
    });
  }

  goToSearchPage(city: string, distribution_type: string) {
      this.router.navigate(['/rechercher'], { queryParams: { ville: city, distribution_type } });
  }
}
