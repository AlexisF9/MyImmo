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
    return this.http.get<any>(this.apiUrl + '/api/advertisements?sort=createdAt:desc&populate=*');
  }

  getAnnouncements(city: string, distribution: string, category?: string, minPrice?: number, maxPrice?: number, limit?: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + `/api/advertisements?filters[$and][0][address][city][$eq]=${city}&filters[$and][1][distribution_type][name][$eq]=${distribution}${category ? '&filters[$and][2][category][name][$eq]=' + category : ''}${minPrice ? '&filters[$and][3][price][$gte]=' + minPrice : ''}${maxPrice ? '&filters[$and][4][price][$lte]=' + maxPrice : ''}&sort=createdAt:desc&pagination[limit]=${limit ? limit : 10}&populate=*`);
  }

  getAnnouncementById(id: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + `/api/advertisements?filters[id][$eq]=${id}&populate=*`);
  }

  getCities(text: string): Observable<any> {
    return this.http.get<any>(`https://api-adresse.data.gouv.fr/search/?q=${text}&type=municipality&limit=10`);
  }

  getAnnouncementByIds(ids: number[]): Observable<any> {
    const filterParams = ids
      .map((id, index) => `filters[id][$in][${index}]=${id}`)
      .join('&');
    
    return this.http.get<any>(this.apiUrl + `/api/advertisements?${filterParams}&sort=createdAt:desc&populate=*`);
  }
}
