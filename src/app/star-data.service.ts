
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Star } from './star.model'; // Ajustez le chemin selon votre structure de projet

@Injectable({
  providedIn: 'root'
})
export class StarDataService {
  private apiUrl = 'http://127.0.0.1:5000'; // URL de votre API Flask

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token'); // Assurez-vous que le token est stocké avec cette clé
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
  }

  getStars(): Observable<Star[]> {
    return this.http.get<Star[]>(`${this.apiUrl}/stars`, { headers: this.getHeaders() });
  }

  getHottestStars(): Observable<Star[]> {
    return this.http.get<Star[]>(`${this.apiUrl}/stars/hottest`, { headers: this.getHeaders() });
  }

  getClosestStars(): Observable<Star[]> {
    return this.http.get<Star[]>(`${this.apiUrl}/stars/closest`, { headers: this.getHeaders() });
  }

  getBrightestStars(): Observable<Star[]> {
    return this.http.get<Star[]>(`${this.apiUrl}/stars/brightest`, { headers: this.getHeaders() });
  }

  getBiggestStars(): Observable<Star[]> {
    return this.http.get<Star[]>(`${this.apiUrl}/stars/biggest`, { headers: this.getHeaders() });
  }
}
