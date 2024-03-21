import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Generic } from './generic.model';

@Injectable({ providedIn: 'root'})
export class DevopsService {

  private readonly backendUrl = 'http://localhost:9090';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Array<Generic>> {
    return this.http.get<Array<Generic>>(`${this.backendUrl}/devops`);
  }

  getById(id: number): Observable<Generic> {
    return this.http.get<Generic>(`${this.backendUrl}/devops/${id}`);
  }
}
