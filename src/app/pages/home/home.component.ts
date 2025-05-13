import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import {MatGridListModule} from '@angular/material/grid-list';
import { CardsListComponent } from "../../components/cards-list/cards-list.component";
import {MatTabsModule} from '@angular/material/tabs';
import { SearchComponent } from "../../components/search/search.component";

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
  }
}

@Component({
  selector: 'app-home',
  imports: [MatGridListModule, CardsListComponent, MatTabsModule, SearchComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  data: Announcement[] | null = null

  filteredBuyData: Announcement[] | null = null
  filteredRentData: Announcement[] | null = null

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getData().subscribe({
      next: (res) => {
        this.data = res.data
        this.filteredBuyData = this.data?.filter((item: Announcement) => item.distribution_type.name === "Acheter") ?? null
        this.filteredRentData = this.data?.filter((item: Announcement) => item.distribution_type.name === "Louer") ?? null
      },
      error: (err) => {
        console.error('Erreur API:', err)
      }
    });
  }

}
