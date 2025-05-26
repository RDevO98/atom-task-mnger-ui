import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-user-confirmation',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogContent, MatButton],
  templateUrl: './user-confirmation.component.html',
  styleUrl: './user-confirmation.component.scss'
})
export class UserConfirmationComponent {
  readonly dialogRef = inject(MatDialogRef<UserConfirmationComponent>);

  aceptar(value: boolean) {
    this.dialogRef.close(value);
  }
}
