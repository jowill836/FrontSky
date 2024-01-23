
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionService } from '../selection.service'; // Assurez-vous que le chemin est correct
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  constructor(private selectionService: SelectionService,private authService: AuthService, private router: Router) {}

  onMenuSelect(category: string) {
    this.selectionService.changeCategory(category);
  }
  logout(): void {
    // Effacer le token JWT et rediriger vers la page de connexion
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }
}
