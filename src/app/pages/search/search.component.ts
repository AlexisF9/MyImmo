import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CardsListComponent } from "../../components/cards-list/cards-list.component";
import { Announcement } from '../home/home.component';
import { LoaderComponent } from "../../components/loader/loader.component";
import { ListFilter, LucideAngularModule, SlidersHorizontal, X } from 'lucide-angular';
import { ButtonComponent } from "../../components/button/button.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [CardsListComponent, LoaderComponent, LucideAngularModule, ButtonComponent, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  readonly ListFilterIcon = ListFilter
  readonly CloseIcon = X
  readonly FiltersIcon = SlidersHorizontal

  @ViewChild('budgetForm') budgetFormRef!: ElementRef;
  @ViewChild('piecesForm') piecesFormRef!: ElementRef;

  data: Announcement[] | null = null
  city: string = ""
  distribution: string = ""
  loading: boolean = false
  openFilters: boolean = false
  category: string = "all"
  price: string = "Budget"
  pieces: string = "Pièces"

  listFilter: boolean = false
  order: string = ""
  orderFilters = [
    {
      label: "Les plus récentes",
      name: "dateDesc",
      active: true
    },
    {
      label: "Prix croissants",
      name: "priceAsc",
      active: false
    },
    {
      label: "Prix décroissants",
      name: "priceDesc",
      active: false
    }
  ]
  inactiveOrderFilters: {label: string, name: string, active: boolean}[] = []
  activeOrderFilters: {label: string, name: string, active: boolean} | undefined = undefined

  form = new FormGroup({
    formDistribution: new FormControl<string>('', [Validators.required]),
    formCategory: new FormControl<string>('all', [Validators.required]),
    formPriceMinimum: new FormControl<number | null>(null),
    formPriceMaximum: new FormControl<number | null>(null),
    formPiecesMinimum: new FormControl<number | null>(null),
    formPiecesMaximum: new FormControl<number | null>(null),
  });
  
  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) {}

  splitOrderFilters() {
    this.inactiveOrderFilters = this.orderFilters.filter((item) => !item.active)
    this.activeOrderFilters = this.orderFilters.find((item) => item.active)
  }
  
  ngOnInit() {
    this.splitOrderFilters()

    this.route.queryParams.subscribe(params => {
      const city = params['ville']
      const distribution_type = params['distribution_type']
      const category = params['category']
      const minPrice = params['minPrice']
      const maxPrice = params['maxPrice']
      const minPieces = params['minPieces']
      const maxPieces = params['maxPieces']
      const order = params['order']

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
          maxPieces ?? undefined,
          order
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

  toggleFilters(goTo?: ElementRef) {
    this.openFilters = !this.openFilters
    document.body.classList.toggle('noscroll');

    // Scroll jusqu'à l'élément
    if (this.openFilters && goTo) {
      setTimeout(() => {
        goTo?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    this.updateData()
    this.toggleFilters()
  }

  updateData() {
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
      maxPieces: rawForm.formPiecesMaximum,
      order: this.activeOrderFilters?.name
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

  @ViewChild('filtersList') filtersListRef!: ElementRef;
  @HostListener('document:click', ['$event'])
  onClickDocument(event: MouseEvent): void {
    const clickedInside = this.filtersListRef?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.listFilter = false
    }
  }

  toggleListFilter() {
    this.listFilter = !this.listFilter
  }

  editOrder(selectedName: string) {
    this.orderFilters = this.orderFilters.map(filter => ({
      ...filter,
      active: filter.name === selectedName
    }));
    
    this.splitOrderFilters()
    this.listFilter = false
    this.updateData()
  }
}
