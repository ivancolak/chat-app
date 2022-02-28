import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class WorkspaceService {
  constructor(private fb: FormBuilder, private http: HttpClient) { }

  fetch() {
    return this.http.get<any>(`${environment.BaseURI}/workspaces`);
  }

  createWorkspace(formData) {
    return this.http.post(environment.BaseURI + '/workspaces', formData);
  }

  getWorkspaceById(id: number) {
    return this.http.get(environment.BaseURI + '');
  }
}
