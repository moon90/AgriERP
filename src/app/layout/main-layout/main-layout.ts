import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
// আপনার tsconfig.base.json অনুযায়ী alias ব্যবহার করুন (অথবা রিলেটিভ পাথ দিন)
import { AuthService } from '../../../../libs/core/services/auth.service';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterModule],
    templateUrl: './main-layout.html',
    styleUrls: ['./main-layout.scss']
})
export class MainLayoutComponent {
    authService = inject(AuthService);
    router = inject(Router);

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}