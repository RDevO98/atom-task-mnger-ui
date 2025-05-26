import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { lastValueFrom, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../../infrastructure/services/auth.service';
import { UserConfirmationComponent } from '../../components/user-confirmation/user-confirmation.component';

@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
})
export class LoginComponent {
  readonly dialog = inject(MatDialog);
  readonly router = inject(Router);
  readonly authService = inject(AuthService);

  readonly email = new FormControl('', [Validators.required, Validators.email]);

  errorMessage = signal('');

  constructor() {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('El correo electrónico es requerido');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('No es un correo electrónico válido');
    } else {
      this.errorMessage.set('');
    }
  }

  onSubmit() {
    this.email.markAllAsTouched();
    this.updateErrorMessage();

    if (this.email.valid) {
      const $login = this.authService.login({ email: this.email.value! });
      lastValueFrom($login, { defaultValue: null }).then((data) => {
        if (data) {
          if (data.askToCreate) {
            const dialogRef = this.dialog.open(UserConfirmationComponent, {
              disableClose: true,
            });

            dialogRef.afterClosed().subscribe((result) => {
              if (result) {
                const $userConfirmed = this.authService.confirm({
                  email: this.email.value!,
                });

                lastValueFrom($userConfirmed, { defaultValue: null }).then(
                  (data) => {
                    if (data) {
                      this.authService.setToken(data.token!);
                    }
                  }
                );
              }
            });
          } else {
            this.authService.setToken(data.token!);
          }
        }
      });
    }
  }
}
