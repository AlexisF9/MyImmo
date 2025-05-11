import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import {MatGridListModule} from '@angular/material/grid-list';
import { CardsListComponent } from "../../components/cards-list/cards-list.component";

export interface Advertisement {
  id: number,
  name: string,
  price: number,
  surface: number,
  pieces: number,
  rooms: number,
  address: string,
  pictures: {
    id: number,
    name: string,
    url: string
  }[],
  distribution_type: {
    name: string
  }
}

@Component({
  selector: 'app-home',
  imports: [MatGridListModule, CardsListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  data: Advertisement[] | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getData().subscribe({
      next: (res) => {
        this.data = res.data
        console.log(this.data)
      },
      error: (err) => console.error('Erreur API:', err)
    });
  }
}
