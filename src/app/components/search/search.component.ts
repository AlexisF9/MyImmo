import { Component, ElementRef, HostListener, model, ViewChild } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ApiService } from '../../services/api.service';
import { debounceTime } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [MatTabsModule, MatIconModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  searchControl = new FormControl();
  selectedTab = new FormControl(0);
  search: string = ""
  data: {city: string, postale_code: string}[] | null = null;
  openResults: boolean = false

  tabs = [
    {
      name: "acheter",
      label: "Acheter"
    },
    {
      name: "louer",
      label: "Louer"
    }
  ]

  constructor(private apiService: ApiService, private router: Router) {}

  @ViewChild('resultsList') resultsListRef!: ElementRef;

  @HostListener('document:click', ['$event'])
  onClickDocument(event: MouseEvent): void {
    const clickedInside = this.resultsListRef?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.openResults = false
    }
  }

  changeSearchControl(city: string, cp: string) {
    this.searchControl.setValue(`${city} (${cp})`)
    this.data = null
    this.router.navigate(['/rechercher'], { queryParams: { ville: city, cp, distribution_type: this.tabs[this.selectedTab.value ?? 0].label } });
  }

  ngOnInit() {
    this.selectedTab.valueChanges.subscribe(data => {
      if (this.selectedTab.value !== data) {
        this.selectedTab.setValue(data, { emitEvent: false });
      }
    });
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(data => {
      this.searchAddress(data)
    });
  }
  
  searchAddress(search: string) {
    if (search.length >= 3) {
      const url = `https://strapi-server-0ymt.onrender.com/api/addresses?filters[$or][0][city][$containsi]=${search}&filters[$or][1][postale_code][$containsi]=${search}&pagination[limit]=10`
      this.apiService.getAddress(url).subscribe({
        next: (res) => {
          this.data = res.data
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