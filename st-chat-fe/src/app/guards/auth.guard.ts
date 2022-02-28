// The Auth guard decides if a user can access a requested Route
import { Injectable } from '@angular/core';

import {
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	CanActivate,
	Router
} from '@angular/router';
import { AuthService } from '../services/user/auth.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(private router: Router, private authService: AuthService) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		const currentUser = this.authService.currentUserValue;
		if (currentUser) {
			// The user is valid, and it is allowed to access the Route
			return true;
		}

		// Redirect the user to the Login page and prevent them from accessing the current Route
		this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
		return false;
	}
}