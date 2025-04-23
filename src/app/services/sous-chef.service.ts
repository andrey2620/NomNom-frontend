import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SousChefService {
  private baseUrl = 'http://localhost:8080/api/sous-chef';

  constructor(private http: HttpClient) {}

  getAudio(text: string, voiceName: string): Observable<Blob> {
    const body = { text, voiceName };

    return this.http.post(`${this.baseUrl}/speak`, body, {
      responseType: 'blob',
    });
  }
}
