import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://strapi-server-0ymt.onrender.com';

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/api/advertisements?populate=*');
  }

  getAddress(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  getAdvertisementsByAddress(city: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + `/api/advertisements?filters[address][city][$eq]=${city}&populate=address`);
  }
}
