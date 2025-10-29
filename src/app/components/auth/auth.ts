import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { loginSuccess } from '../../store/login/login.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})

export class Auth implements OnInit {
  constructor(private auth: AuthService, private store: Store) {};
  authForm!: FormGroup;
  showAnnotation: boolean = true;

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  initAuthForm() {
    this.authForm = new FormGroup({
      login: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }


  onSubmit() {
    if (this.authForm.valid) {
      const { login, password } = this.authForm.value;
      this.auth.login(login, password).subscribe((user): void => {
          if (user.length > 0) {
            const role = user[0]?.role || 'user';
            this.store.dispatch(loginSuccess({ 
              login: user[0].login,
              flags: {
                [role]: true
              }
            }
          ));
          }
      });
    }
  }


  ngOnInit(): void {
    this.initAuthForm();
  }
}

