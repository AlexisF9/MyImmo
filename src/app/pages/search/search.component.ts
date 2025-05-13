import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CardsListComponent } from "../../components/cards-list/cards-list.component";
import { Announcement } from '../home/home.component';
import { LoaderComponent } from "../../components/loader/loader.component";

@Component({
  selector: 'app-search',
  imports: [CardsListComponent, LoaderComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  data: Announcement[] | null = null
  city: string = ""
  distribution_type: string = ""
  loading: boolean = false

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const city = params['ville'];
      const postale_code = params['cp'];
      const distribution_type = params['distribution_type'];
      this.city = city
      this.distribution_type = distribution_type

      if (!city && !postale_code && !distribution_type) {
        this.router.navigate(['/']);
      } else {
        this.loading = true
        this.apiService.getAdvertisementsByAddress(city, distribution_type).subscribe({
          next: (res) => {
            this.data = res.data
            this.loading = false
          },
          error: (err) => {
            console.error('Erreur API:', err)
            this.loading = false
          }
        });
      }
    });
  }
}
