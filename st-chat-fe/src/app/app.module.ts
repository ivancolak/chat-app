import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MaterialModule } from './material.module';
import { LoginComponent } from './components/login/login.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddWorkspaceComponent } from './components/add-workspace/add-workspace.component';
import { AvatarModule } from 'ngx-avatar';

import { HomeComponent } from './components/home/home.component';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './components/chat/chat.component';
import { environment } from 'src/environments/environment';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AuthInterceptorProvider } from './interceptors/auth.interceptor';
import { ErrorInterceptorProvider } from './interceptors/error.interceptor';
import { MessageComponent } from './components/message/message.component';
import { RoomComponent } from './components/room/room.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxAgoraModule, AgoraConfig } from 'ngx-agora';
import { VideoComponent } from './components/video/video.component';
import { InviteUserComponent } from './components/invite-user/invite-user.component';
import { PasswordComponent } from './components/password/password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

const config: SocketIoConfig = { url: environment.webSocketURL, options: {} };

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

const agoraConfig: AgoraConfig = {
  AppID: '2ad070bf8ce04f488293a2a8b203e751',
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WorkspaceComponent,
    UserInfoComponent,
    AddWorkspaceComponent,
    HomeComponent,
    ChatComponent,
    RoomComponent,
    PasswordComponent,
    MessageComponent,
    RoomComponent,
    VideoComponent,
    InviteUserComponent,
    ForgotPasswordComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AvatarModule,
    SocketIoModule.forRoot(config),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxAgoraModule.forRoot(agoraConfig)
  ],
  providers: [AuthInterceptorProvider, ErrorInterceptorProvider],
  entryComponents: [AddWorkspaceComponent, RoomComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
