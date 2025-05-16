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
  distribution: string = ""
  loading: boolean = false
  openFilters: boolean = false
  category: string = "all"
  price: string = "Budget"
  pieces: string = "Pièces"

  readonly CloseIcon = X

  form = new FormGroup({
    formDistribution: new FormControl<string>('', [Validators.required]),
    formCategory: new FormControl<string>('all', [Validators.required]),
    formPriceMinimum: new FormControl<number | null>(null),
    formPriceMaximum: new FormControl<number | null>(null),
    formPiecesMinimum: new FormControl<number | null>(null),
    formPiecesMaximum: new FormControl<number | null>(null),
  });

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) {}

  @ViewChild('targetElement') targetElement!: ElementRef;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const city = params['ville']
      const distribution_type = params['distribution_type']
      const category = params['category']
      const minPrice = params['minPrice']
      const maxPrice = params['maxPrice']
      const minPieces = params['minPieces']
      const maxPieces = params['maxPieces']

      this.city = city
      this.distribution = distribution_type
      this.category = !category ? 'all' : category
      this.price = minPrice && maxPrice ? `${minPrice} € - ${maxPrice} €` : minPrice ? `minimum ${minPrice} €` : maxPrice ? `maximum ${maxPrice} €` : 'Budget'
      this.pieces = minPieces && maxPieces ? `${minPieces} - ${maxPieces} pièces` : minPieces ? `minimum ${minPieces} pièces` : maxPieces ? `maximum ${maxPieces} pièces` : 'Pièces'

      if (!city && !distribution_type) {
        this.router.navigate(['/'])
      } else {
        this.form.get('formDistribution')?.setValue(distribution_type)
        this.form.get('formCategory')?.setValue(this.category)
        this.form.get('formPriceMinimum')?.setValue(minPrice ?? null)
        this.form.get('formPriceMaximum')?.setValue(maxPrice ?? null)
        this.form.get('formPiecesMinimum')?.setValue(minPieces ?? null)
        this.form.get('formPiecesMaximum')?.setValue(maxPieces ?? null)

        this.loading = true
        this.apiService.getAnnouncements(
          city,
          distribution_type,
          category === "all" ? undefined : category,
          minPrice ?? 0,
          maxPrice ?? undefined,
          minPieces ?? 0,
          maxPieces ?? undefined
        ).subscribe({
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
    this.toggleFilters()

    const rawForm = this.form.value;

    let params: any = {
      ville: this.city,
      distribution_type: this.form.value.formDistribution ?? this.distribution
    }
    
    const optionalParams = {
      category: rawForm.formCategory !== 'all' ? rawForm.formCategory : null,
      minPrice: rawForm.formPriceMinimum,
      maxPrice: rawForm.formPriceMaximum,
      minPieces: rawForm.formPiecesMinimum,
      maxPieces: rawForm.formPiecesMaximum
    };

    // Ajouter seulement les clés non nulles/non undefined
    Object.entries(optionalParams).forEach(([key, value]) => {
      if (value != null) {
        params[key] = value;
      }
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params
      //queryParamsHandling: 'merge',
    });
  }

  reset() {
    this.form.reset({
      formDistribution: this.distribution,
      formCategory: 'all',
      formPriceMinimum: null,
      formPriceMaximum: null,
      formPiecesMinimum: null,
      formPiecesMaximum: null
    });
  }
}
