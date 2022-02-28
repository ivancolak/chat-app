import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  fetchAllInfo(): Observable<User> {
    return this.http.get<any>(`${environment.BaseURI}/auth/user`).pipe(
      map(response => response as User)
    )
  }

  uploadProfileImage(formData: FormData): Observable<any> {
    return this.http.post(`${environment.BaseURI}/auth/upload`, formData);
  }

  setNewPassword(formData: FormData): Observable<any> {
    return this.http.post(`${environment.BaseURI}/auth/reset-password`, formData);
  }

}
