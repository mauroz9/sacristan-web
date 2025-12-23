import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArasaacPictogram } from '../interfaces/arasaac-interface';
import { HttpClient } from '@angular/common/http';

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

  getPictogramImage(id: number): Observable<any>{
    return this.http.get<any>(`https://static.arasaac.org/pictograms/${id}/${id}_2500.png`)
  }
}
