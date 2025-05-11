import { Component, input } from '@angular/core';
import { CardComponent } from "../card/card.component";
import { Advertisement } from '../../pages/home/home.component';

@Component({
  selector: 'app-cards-list',
  imports: [CardComponent],
  templateUrl: './cards-list.component.html',
  styleUrl: './cards-list.component.scss'
})
export class CardsListComponent {
  data = input.required<Advertisement[]>()
}
