import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (data) => {
        this.authService.setToken(data.access_token);
        this.router.navigate(['/main']);
      },
      error: (e) => this.errorMessage = 'Échec de la connexion'
    });
  }
}
