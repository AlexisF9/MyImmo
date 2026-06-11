import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://strapi-server-0ymt.onrender.com';

  constructor(private http: HttpClient) {}

  getAnnouncements(
    city: string,
    distribution: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    minPieces?: number,
    maxPieces?: number,
    order?: string,
    limit?: number,
  ): Observable<any> {
    return this.http.get<any>(
      this.apiUrl +
        `/api/advertisements?filters[$and][0][address][city][$eq]=${city}&filters[$and][1][distribution_type][name][$eq]=${distribution}${category ? '&filters[$and][2][category][name][$eq]=' + category : ''}${minPrice ? '&filters[$and][3][price][$gte]=' + minPrice : ''}${maxPrice ? '&filters[$and][4][price][$lte]=' + maxPrice : ''}${minPieces ? '&filters[$and][5][pieces][$gte]=' + minPieces : ''}${maxPieces ? '&filters[$and][6][pieces][$lte]=' + maxPieces : ''}&sort=${order === 'priceAsc' ? 'price:asc' : order === 'priceDesc' ? 'price:desc' : 'createdAt:desc'}&pagination[limit]=${limit ? limit : 10}&populate=*`,
    );
  }

  getAnnouncementByAddress(
    city: string,
    distribution: string,
    limit?: number,
  ): Observable<any> {
    return this.http.get<any>(
      this.apiUrl +
        `/api/advertisements?filters[$and][0][address][city][$eq]=${city}&filters[$and][1][distribution_type][name][$eq]=${distribution}&sort=createdAt:desc&pagination[limit]=${limit ? limit : 10}&populate=*`,
    );
  }

  getAnnouncementByDocumentId(documentId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/api/advertisements/${documentId}?populate=*`,
    );
  }

  getCities(text: string): Observable<any> {
    return this.http.get<any>(
      `https://api-adresse.data.gouv.fr/search/?q=${text}&type=municipality&limit=10`,
    );
  }

  getAnnouncementByIds(ids: { id: number }[]): Observable<any> {
    const filterParams = ids
      .map((id, index) => `filters[id][$in][${index}]=${id.id}`)
      .join('&');

    return this.http.get<any>(
      this.apiUrl +
        `/api/advertisements?${filterParams}&sort=createdAt:desc&populate=*`,
    );
  }

  addAdvertisementToUser(
    advertisementId: string,
    userDocumentId: string,
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/api/advertisements/${advertisementId}`,
      {
        data: {
          users_permissions_users: {
            connect: [{ documentId: userDocumentId }],
          },
        },
      },
    );
  }

  removeAdvertisementFromUser(
    advertisementId: string,
    userDocumentId: string,
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/api/advertisements/${advertisementId}`,
      {
        data: {
          users_permissions_users: {
            disconnect: [{ documentId: userDocumentId }],
          },
        },
      },
    );
  }

  removeAllAdvertisementsFromUser(
    userId: number,
    userDocumentId: string,
  ): Observable<any> {
    return this.getAdvertisementsByUser(userId).pipe(
      switchMap((res) => {
        if (res.data.length === 0) {
          return of([]);
        }

        const requests = res.data.map((ad: any) => {
          return this.removeAdvertisementFromUser(
            ad.documentId,
            userDocumentId,
          );
        });
        return forkJoin(requests);
      }),
    );
  }

  getAdvertisementsByUser(userId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/api/advertisements?filters[users_permissions_users][id][$eq]=${userId}&populate=*`,
    );
  }
}
