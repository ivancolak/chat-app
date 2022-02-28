import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Socket } from 'ngx-socket-io';
import { Room } from 'src/app/models/room/room';
import { User } from 'src/app/models/user/user';
import { Userroom } from 'src/app/models/userroom/userroom';
import { Workspace } from 'src/app/models/workspace/workspace';
import { RoomService } from 'src/app/services/room/room.service';
import { AuthService } from 'src/app/services/user/auth.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {
  room: Room;
  form: FormGroup;
  selectedWorkspace: Workspace;
  user: string;
  userRoom: Userroom = new Userroom();

  constructor(
    public dialogRef: MatDialogRef<RoomComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Room,
    private roomService: RoomService,
    private authService: AuthService,
    private socket: Socket
  ) {}

  ngOnInit(): void {
    this.load();
    this.user = this.authService.currentUserValue.id;
  }

  onNoClick(): void {
    this.dialogRef.close({ success: false });
  }

  onCreateClick(): void {
    this.roomService.createRoom(this.form.value).subscribe(
      (res: any) => {
        this.userRoom.roomName = res.name;
        this.userRoom.userId = this.user;
        this.socket.emit('createRoom', this.userRoom.roomName);
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
      name: new FormControl(),
    });
  }
}
