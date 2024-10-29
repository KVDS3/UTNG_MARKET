import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../enviroment';

@Injectable({
  providedIn: 'root'
})
export class RfcService {
  private baseUrl = 'http://localhost:3000/rfc';

  constructor(private http: HttpClient) { }

  getRFC(rfc: string): Observable<any> {
    console.log(this.http.get<any>(this.baseUrl+'/'+rfc))
    return this.http.get<any>(this.baseUrl+'/'+rfc);
  }
}
