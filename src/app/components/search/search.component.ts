import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { debounceTime } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  //searchControl = new FormControl();
  //testControl: string = "acheter";
  //selectedTab = new FormControl(0);
  search: string = ""
  data: { properties: { city: string, postcode: string } }[] | null = null;
  openResults: boolean = false

  form = new FormGroup({
    distribution: new FormControl<string>('Acheter', [Validators.required]),
    search: new FormControl<string | null>(null, [Validators.required]),
  });

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    console.log(this.form.value);
  }

  @ViewChild('resultsList') resultsListRef!: ElementRef;

  @HostListener('document:click', ['$event'])
  onClickDocument(event: MouseEvent): void {
    const clickedInside = this.resultsListRef?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.openResults = false
    }
  }

  changeSearchControl(city: string) {
    this.router.navigate(['/rechercher'], { queryParams: { ville: city, distribution_type: this.form.get('distribution')?.value } });
  }

  ngOnInit() {
    //this.selectedTab.valueChanges.subscribe(data => {
    //  if (this.selectedTab.value !== data) {
    //    this.selectedTab.setValue(data, { emitEvent: false });
    //  }
    //});
    //this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(data => {
    //  this.searchAddress(data)
    //});
    this.form.get('search')?.valueChanges.pipe(debounceTime(300)).subscribe(data => {
      data && this.searchAddress(data)
    });
  }
  
  searchAddress(search: string) {
    if (search.length >= 3) {
      //const url = `https://strapi-server-0ymt.onrender.com/api/addresses?filters[$or][0][city][$containsi]=${search}&filters[$or][1][postale_code][$containsi]=${search}&pagination[limit]=10`
      this.apiService.getCities(search).subscribe({
        next: (res) => {
          this.data = res.features
          if (this.data && this.data?.length > 0) {
            this.openResults = true
          }
        },
        error: (err) => {
          console.error('Erreur API:', err)
          this.data = null
        }
      });
    } else {
      this.data = null
    }
  }
}