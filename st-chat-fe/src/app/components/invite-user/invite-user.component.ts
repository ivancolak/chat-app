import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Room } from 'src/app/models/room/room';
import { Workspace } from 'src/app/models/workspace/workspace';
import { RoomService } from 'src/app/services/room/room.service';
import { AuthService } from 'src/app/services/user/auth.service';
import { WorkspaceComponent } from '../workspace/workspace.component';
@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.css'],
})
export class InviteUserComponent implements OnInit {
  form: FormGroup;
  selectedWorkspace: Workspace;

  constructor(
    public dialogRef: MatDialogRef<InviteUserComponent>,
    private authService: AuthService,
    private roomService: RoomService,
    @Inject(MAT_DIALOG_DATA) public data: Room
  ) {}

  ngOnInit(): void {
    this.load();
  }

  onNoClick(): void {
    this.dialogRef.close({ success: false });
  }

  onCreateClick(): void {
    this.roomService.inviteToWorkspace(this.form.value).subscribe(
      (res: any) => {
        this.dialogRef.close({ success: true, data: res });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  load() {
    this.selectedWorkspace = JSON.parse(localStorage.getItem('workspace'));
    this.form = new FormGroup({
      workspaceId: new FormControl(this.selectedWorkspace.id.toString()),
      username: new FormControl(),
      email: new FormControl('', Validators.email),
    });
  }
}
