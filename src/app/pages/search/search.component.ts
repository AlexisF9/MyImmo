import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CardsListComponent } from "../../components/cards-list/cards-list.component";
import { Announcement } from '../home/home.component';
import { LoaderComponent } from "../../components/loader/loader.component";
import { LucideAngularModule, X } from 'lucide-angular';
import { ButtonComponent } from "../../components/button/button.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [CardsListComponent, LoaderComponent, LucideAngularModule, ButtonComponent, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  data: Announcement[] | null = null
  city: string = ""
  distribution_type: string = ""
  loading: boolean = false
  openFilters: boolean = false
  readonly CloseIcon = X

  form = new FormGroup({
    distribution: new FormControl<string>('', [Validators.required]),
  });

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) {}

  @ViewChild('targetElement') targetElement!: ElementRef;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const city = params['ville']
      const distribution_type = params['distribution_type']
      this.city = city
      this.distribution_type = distribution_type

      if (!city && !distribution_type) {
        this.router.navigate(['/'])
      } else {

        this.form.get('distribution')?.setValue(distribution_type)
        console.log(this.form.get('distribution'))


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

  toggleFilters() {
    this.openFilters = !this.openFilters
    document.body.classList.toggle('noscroll');

    //if (this.openFilters) {
    //  setTimeout(() => {
    //    this.targetElement?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    //  }, 300); // correspond au délai de ta transition CSS
    //}
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    //console.log(this.form.value);

    this.toggleFilters()

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { distribution_type: this.form.value.distribution },
      queryParamsHandling: 'merge',
    });
  }
}
