import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user/user';
import jwt_decode from 'jwt-decode';

export interface ApplicationUser {
  accessToken: string;
  expiresIn: Date;
  username: string;
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<ApplicationUser>;
  public currentUser: Observable<ApplicationUser>;

  constructor(private readonly http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<ApplicationUser>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): ApplicationUser {
    return this.currentUserSubject.value;
  }
  login(username: string, password: string) {
    return this.http

      .post<any>(`${environment.BaseURI}/auth/login`, { username, password })
      .pipe(
        map((response) => {
          if (response && response.accessToken) {
            const user = jwt_decode<User>(response.accessToken);
            response.id = user.id;
            this.currentUserSubject.next(response);
            localStorage.setItem('currentUser', JSON.stringify(response));
          }
          return response;
        })
      );
	}
	logout() {
		localStorage.removeItem('currentUser');
		this.currentUserSubject.next(null);
	}

	forgotPassword(formData) {
		return this.http.post(`${environment.BaseURI}/auth/forgotPassword`, formData);
	}
}
