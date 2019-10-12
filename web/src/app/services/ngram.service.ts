import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NGramEntry {
  item: string;
  known: boolean;
  totalCount: number;
}

interface RawTextInput {
  rawText: string;
}

@Injectable({
  providedIn: 'root'
})
export class NgramService {

  constructor(private httpClient: HttpClient) { }

  public getNgrams(type: string, known: string, limit: string): Observable<NGramEntry[]> {
    const params = new HttpParams().set('known', known).set('limit', limit);
    return this.httpClient.get<NGramEntry[]>(`/api/ngrams/no/${type}`, { params });
  }

  public addRaw(rawText: string): Observable<any> {
    return this.httpClient.post<RawTextInput>(`/api/add-ngrams/raw/no`, { rawText });
  }
}
