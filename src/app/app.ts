import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from './components/auth/auth';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn } from './store/login/login.selector';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LoginState } from './store/login/login.state';
import { Header } from './components/header/header';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Auth, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
    constructor(private store: Store<{ login: LoginState }>) {
      this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
      this.store.subscribe(state => {
    });
  }

  isLoggedIn$: Observable<boolean>;
}

