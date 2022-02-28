import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Socket } from 'ngx-socket-io';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/user/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    public translate: TranslateService,
    private snackBar: MatSnackBar
  ) {
    translate.addLangs(['en', 'sr']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|sr/) ? browserLang : 'en');
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.authService.logout();
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService
      .login(this.form.username.value, this.form.password.value)
      .subscribe(
        data => {
          this.router.navigate(['/home']);
        },
        () => this.snackBar.open('Failed to login', null, { duration: 800 })
      );
  }
}
