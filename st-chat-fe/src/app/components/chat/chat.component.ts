import { Component, OnInit } from '@angular/core';
import { RoomService } from 'src/app/services/room/room.service';
import { Workspace } from 'src/app/models/workspace/workspace';
import { Room } from 'src/app/models/room/room';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'src/app/models/message/message';
import { Socket } from 'ngx-socket-io';
import { RoomComponent } from '../room/room.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/user/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  selectedWorkspace: Workspace;
  rooms: Room[];
  messageForm: FormGroup;
  loggedUserId: string;
  messages: Message[] = [];
  currentUser: User;
  selectedRoom: Room;

  constructor(
    private roomService: RoomService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private socket: Socket,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
    this.userService.fetchAllInfo().subscribe(user => this.currentUser = user)
    this.socket.fromEvent<Message>('chatToFront').subscribe((message) => {
      if (this.selectedRoom.id == message.roomId) {
        if (!this.messages.includes(message)) {
          this.messages.push(message);
        }
      } else {
        this.rooms.forEach((room) => {
          if (room.id == message.roomId) {
            room.checkNotification = true;
          }
        });
      }
    });
  }

  selectRoom(room: Room) {
    this.selectedRoom = room;
    room.checkNotification = false;
    
    this.socket.emit('userSelectedRoom', [this.loggedUserId, room.id]);
    this.socket.fromEvent('RoomMessages').subscribe(
      (res: Message[]) => {
        this.messages = res.sort((a: Message, b: Message) =>
          a.date.localeCompare(b.date)
        );
      },
      (err) => {
        this.messages = [];
      }
    );
  }

  sendMessage() {
    const message = new Message();
    message.userId = this.loggedUserId;
    message.roomId = this.selectedRoom.id;
    message.content = this.form.message.value;
    message.date = new Date().toString();
    message.user = this.currentUser;
    this.socket.emit('chat', message);

    this.messageForm.reset();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(RoomComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.rooms.push(result.data);
    });
  }

  startVideoCall() {
    this.router.navigate(['conference', this.selectedRoom.id])
  }

  load() {
    this.messageForm = this.fb.group({ message: ['', Validators.required] });
    this.loggedUserId = this.authService.currentUserValue.id;
    this.selectedWorkspace = JSON.parse(localStorage.getItem('workspace'));
    this.roomService.getRoomsByWorkspaceId(this.selectedWorkspace.id).subscribe(
      (rooms: Room[]) => (this.rooms = rooms),
      (err) => console.log(err)
    );
  }

  get form() {
    return this.messageForm.controls;
  }
}
