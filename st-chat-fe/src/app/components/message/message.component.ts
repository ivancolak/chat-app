import { Component, Input, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Message } from 'src/app/models/message/message';
import { AuthService } from 'src/app/services/user/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnInit {
  @Input()
  reverse: boolean;

  @Input()
  message: Message;

  currentUserId: string;
  profileImageUrl: string;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (this.message.user.profileImage != null) {
      this.profileImageUrl = `${environment.BaseURI}/${this.message.user.profileImage}`;
      console.log(this.profileImageUrl);
    }
    this.currentUserId = this.authService.currentUserValue.id;
  }
}
