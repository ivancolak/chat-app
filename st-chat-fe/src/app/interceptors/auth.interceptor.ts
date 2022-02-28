import {
	HttpInterceptor,
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/user/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(private authService: AuthService) { }

	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		const currentUser = this.authService.currentUserValue;

		if (currentUser && currentUser.accessToken) {
			request = request.clone({
				setHeaders: {
					Authorization: `Bearer ${currentUser.accessToken}`
				}
			});
		}

		return next.handle(request);
	}
}

export const AuthInterceptorProvider = {
	provide: HTTP_INTERCEPTORS,
	useClass: AuthInterceptor,
	multi: true
};