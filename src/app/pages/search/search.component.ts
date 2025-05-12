import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const city = params['ville'];
      const postale_code = params['cp'];
      const distribution_type = params['distribution_type'];

      if (!city && !postale_code && !distribution_type) {
        this.router.navigate(['/']);
      } else {
        this.apiService.getAdvertisementsByAddress(city, distribution_type).subscribe({
          next: (res) => {
            console.log(res.data)
          },
          error: (err) => {
            console.error('Erreur API:', err)
          }
        });
      }
    });
  }
}
