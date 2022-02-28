import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Workspace } from 'src/app/models/workspace/workspace';
import { WorkspaceService } from 'src/app/services/workspaces/workspace.service';

@Component({
  selector: 'app-add-workspace',
  templateUrl: './add-workspace.component.html',
  styleUrls: ['./add-workspace.component.css']
})
export class AddWorkspaceComponent {
  createWs: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddWorkspaceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Workspace, private workspaceService: WorkspaceService) { }

  ngOnInit(): void {
    this.load();
  }

  onNoClick(): void {
    this.dialogRef.close({success:false});
  }

  onCreateClick(): void {
    this.workspaceService.createWorkspace(this.createWs.value).subscribe(
      (res: any) => {
        this.dialogRef.close({success:true, data:res});
      },
      err => {
        console.log(err);
      });
  }

  load() {
    this.createWs = new FormGroup({
      name: new FormControl()
    });
  }
}
