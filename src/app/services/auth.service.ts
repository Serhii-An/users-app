import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { registeredUser } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:3001';

  login(login: string, password: string) {
  return this.http.get<registeredUser[]>(`${this.apiUrl}/registeredUsers`, {
    params: {
      login,
      password
    }
  });
}

}
