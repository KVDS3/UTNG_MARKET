import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../enviroment';

@Injectable({
  providedIn: 'root'
})
export class RfcService {
  private apiKey = 'edb32658-9ea6c9a1';
  private baseUrl = 'https://satpi.mx/api/search/';

  constructor(private http: HttpClient) {}

  consultarRfc(rfc: string): Observable<any> {
    const headers = new HttpHeaders({
      'x-api-key': this.apiKey
    });

    return this.http.get(`${this.baseUrl}${rfc}`, { headers });
  }
}
