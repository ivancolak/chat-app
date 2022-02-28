import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { User } from 'src/app/models/user/user';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  user: User;

  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;

  file: File;
  form: FormGroup;
  profileImageUrl: string;

  constructor(private fb: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    this.form = this.fb.group({});

    this.userService.fetchAllInfo().subscribe(user => {
      this.user = user;
      this.profileImageUrl = `${environment.BaseURI}/${user.profileImage}`
    });

  }

  onClick() {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.click();
    fileInput.onchange = () => {
      this.file = fileInput.files[0];
      this.fileUpload.nativeElement.value = '';
      this.uploadFile();
    }
  }

  uploadFile() {
    const formData = new FormData();
    formData.append('file', this.file);

    this.userService.uploadProfileImage(formData).subscribe((user: User) => {
      this.profileImageUrl = `${environment.BaseURI}/${user.profileImage}`;
    })
  }

}
