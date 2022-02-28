import { Component, OnInit } from '@angular/core';
import { Workspace } from '../../models/workspace/workspace';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Room } from 'src/app/models/room/room';
import { RoomService } from 'src/app/services/room/room.service';
import { AuthService } from 'src/app/services/user/auth.service';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { InviteUserComponent } from '../invite-user/invite-user.component';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css'],
})
export class WorkspaceComponent implements OnInit {
  selectedWorkspace: Workspace;
  allRooms: Room[];
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor(
    private router: Router,
    private socket: Socket,
    private authService: AuthService,
    private roomService: RoomService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.selectedWorkspace = JSON.parse(localStorage.getItem('workspace'));

    this.roomService.getRoomsByWorkspaceId(this.selectedWorkspace.id).subscribe(
      (res: Room[]) => {
        this.allRooms = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  logout() {
    this.socket.emit('logout');
    localStorage.removeItem('currentUser');

    this.socket.disconnect();
    this.router.navigate(['/login']);
  }

  redirectToChat() {
    this.router.navigate(['/chat']);
  }

  redirectToProfile() {
    this.router.navigate(['/profile']);
  }

  onInvite(): void {
    const dialogRef = this.dialog.open(InviteUserComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  redirectToPassword() {
    this.router.navigate(['/password']);
  }
}
