import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, NgForm, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
  myForm: FormGroup;
  hide = true;

  constructor(
    private formBuilder: FormBuilder, 
    private userService: UserService,
    private router: Router ) {}
 
  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['']
    }, { validator: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) { 
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  onClick(): void {
    this.userService.setNewPassword(this.myForm.value).subscribe(
      (res: any) => {
        console.log(res);
        this.router.navigate(['/home']);
      },
      err => {
        console.log(err);
      });
  }
}
