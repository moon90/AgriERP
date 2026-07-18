import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const token = localStorage.getItem('jwt_token');

    // যদি টোকেন থাকে, তবে ভেতরে ঢুকতে দেবে
    if (token) {
        return true;
    }

    // টোকেন না থাকলে লগইন পেজে রিডাইরেক্ট করে দেবে
    router.navigate(['/login']);
    return false;
};