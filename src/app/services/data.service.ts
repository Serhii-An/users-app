import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CitySearchResult, NewUser, User } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3001';
  private usersAPIUrl = `${this.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  addUser(userData: NewUser, userId?: string): Observable<User> {
    if (userId) {
      return this.http.put<User>(`${this.usersAPIUrl}/${userId}`, userData);
    }

    return this.http.post<User>(`${this.usersAPIUrl}`, userData);
  }

  deleteUser(userId: string) {
    return this.http.delete(`${this.usersAPIUrl}/${userId}`);
  }

  getCity(searchStr: string): Observable<CitySearchResult> {
    return this.http.get<CitySearchResult>(`https://api.sat.ua/study/hs/api/v1.0/main/json/getTowns?searchString=${searchStr}`);
  }

  checkNickName(nickname: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.usersAPIUrl}?nickName=${nickname}`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.usersAPIUrl}`);
  }
}