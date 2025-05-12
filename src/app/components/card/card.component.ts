import { Component, input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { Announcement } from '../../pages/home/home.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [ MatCardModule, RouterLink ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  announcement = input.required<Announcement>()
  ceil = Math.ceil
}
