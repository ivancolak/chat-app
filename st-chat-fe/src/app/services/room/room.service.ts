import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private http: HttpClient) {}

  getRoomsByWorkspaceId(id: number) {
    return this.http.get(environment.BaseURI + '/rooms' + '?workspaceId=' + id);
  }

  createRoom(formData) {
    return this.http.post(environment.BaseURI + '/rooms', formData);
  }

  inviteToRoom(formData) {
    return this.http.post(
      environment.BaseURI + '/rooms/inviteToRoom',
      formData
    );
  }

  inviteToWorkspace(formData) {
    return this.http.post(
      environment.BaseURI + '/rooms/inviteToWorkspace',
      formData
    );
  }
}
