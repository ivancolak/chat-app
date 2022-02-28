import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Workspace } from 'src/app/models/workspace/workspace';
import { AuthService } from 'src/app/services/user/auth.service';
import { WorkspaceService } from 'src/app/services/workspaces/workspace.service';
import { AddWorkspaceComponent } from '../add-workspace/add-workspace.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  workspaces: WorkspaceService[];

  constructor(
    private workspaceService: WorkspaceService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private socket: Socket
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddWorkspaceComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.workspaces.push(result.data);
    });
  }

  fetch() {
    this.workspaceService.fetch().subscribe({
      next: (response: WorkspaceService[]) => (this.workspaces = response),
    });
  }

  goToWorkspace(workspace: Workspace) {
    const loggedUserId = this.authService.currentUserValue.id;
    this.socket.emit('userSelectedWorkspace', [loggedUserId, workspace.id]);
    localStorage.setItem('workspace', JSON.stringify(workspace));
    this.router.navigate(['chat']);
  }
}
