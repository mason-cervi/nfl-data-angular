import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerDataService {
  private apiUrl = 'http://localhost:3000/api/player_data';

  constructor(private http: HttpClient) {}

  getPlayerData(statistic: string, year: number, week: number, position: string): Observable<any> {
    // Query parameters
    const params = new HttpParams()
      .set('statistic', statistic)
      .set('year', year.toString())
      .set('week', week.toString())
      .set('position', position);

    // Pass query parameters using the params option
    return this.http.get<any>(this.apiUrl, { params });
  }
}

