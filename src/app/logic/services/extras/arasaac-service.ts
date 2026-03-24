import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ArasaacPictogram } from '../../interfaces/content/arasaac-interface';

const baseAPIUrl: string = 'https://api.arasaac.org/v1';
const language: string = 'es';

@Injectable({
  providedIn: 'root',
})
export class ArasaacService {
  
  constructor(private http: HttpClient){}

  getPictograms(): Observable<ArasaacPictogram[]>{
    return this.http.get<ArasaacPictogram[]>(`${baseAPIUrl}/pictograms/all/${language}`);
  }

  getPictogramById(id: number): Observable<ArasaacPictogram>{
    return this.http.get<ArasaacPictogram>(`${baseAPIUrl}/pictograms/${id}`);
  }

  getPictogramsBySearch(search: string): Observable<ArasaacPictogram[]>{
    return this.http.get<ArasaacPictogram[]>(`${baseAPIUrl}/pictograms/${language}/search/${search}`);
  }

  getPictogramImage(id: number): string{
    return `https://static.arasaac.org/pictograms/${id}/${id}_500.png`;
  }
}
