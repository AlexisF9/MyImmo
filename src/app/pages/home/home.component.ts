import { Component } from '@angular/core';
import { CardComponent } from "../../components/card/card.component";
import { ApiService } from '../../services/api.service';
import {MatGridListModule} from '@angular/material/grid-list';

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
  }[]
}

@Component({
  selector: 'app-home',
  imports: [CardComponent, MatGridListModule],
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
