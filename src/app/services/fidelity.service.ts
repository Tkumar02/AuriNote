import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FidelityService {

  private apiUrl = 'https://fid-api-i90t.onrender.com/scrape'; // Your Render API URL
  //private apiUrl = 'http://127.0.0.1:8000/scrape'
  constructor(private http: HttpClient) { }

  getPrice(url: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { url });
  }
}
