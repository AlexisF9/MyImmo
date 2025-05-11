import { Component, input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { Advertisement } from '../../pages/home/home.component';

@Component({
  selector: 'app-card',
  imports: [ MatCardModule ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  advertisement = input.required<Advertisement>()
  ceil = Math.ceil
}
