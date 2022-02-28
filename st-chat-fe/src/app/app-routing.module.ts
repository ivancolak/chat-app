import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { AuthGuard } from 'src/app/guards/auth.guard'
import { UserInfoComponent } from './components/user-info/user-info.component';
import { HomeComponent } from './components/home/home.component';
import { ChatComponent } from './components/chat/chat.component';
import { VideoComponent } from './components/video/video.component';
import { PasswordComponent } from './components/password/password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: '',
    component: WorkspaceComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'chat', component: ChatComponent },
      { path: 'profile', component: UserInfoComponent },
      { path: 'password', component: PasswordComponent}
    ]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'conference/:id',
    component: VideoComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
