import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RawTextInput, NGramEntry, NGramFilters, NGramDetailEntry } from '../types/types';

@Injectable({
  providedIn: 'root'
})
export class NgramService {

  constructor(private httpClient: HttpClient) { }

  public getNgrams(filters: NGramFilters): Observable<NGramEntry[]> {
    const params = new HttpParams().set('known', filters.known).set('limit', filters.limit.toString());
    return this.httpClient.get<NGramEntry[]>(`/api/ngrams/no/${filters.type}`, { params });
  }

  public getNgramDetail(ngramType: string, id: string): Observable<NGramDetailEntry> {
    return this.httpClient.get<NGramDetailEntry>(`/api/ngrams/no/${ngramType}/${id}`);
  }

  public addRaw(rawText: RawTextInput): Observable<any> {
    return this.httpClient.post<RawTextInput>(`/api/add-ngrams/raw/no`, rawText);
  }
}
