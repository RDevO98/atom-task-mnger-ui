import {
  Component,
  Inject,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { lastValueFrom, merge } from 'rxjs';
import { TaskService } from '../../../infrastructure/services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogContent,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatSlideToggle,
    ReactiveFormsModule,
    MatError,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {
  readonly dialogRef = inject(MatDialogRef<TaskFormComponent>);
  readonly taskService = inject(TaskService);

  readonly form = new FormGroup({
    title: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(100),
    ]),
    description: new FormControl<string | null>(null),
    completed: new FormControl<boolean>(false),
  });

  readonly errorMessages: Record<string, WritableSignal<string>> = {
    title: signal(''),
    description: signal(''),
    completed: signal(''),
  };

  readonly validationMessages: Record<string, Record<string, string>> = {
    title: {
      required: 'El titulo es requerido',
      maxlength: 'El titulo es demasiado largo',
    },
  };

  get titleControl(): FormControl {
    return this.form.get('title') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get completedControl(): FormControl {
    return this.form.get('completed') as FormControl;
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: { id: string | null }) {
    Object.keys(this.form.controls).forEach((controlName) => {
      const control = this.form.get(controlName);
      merge(control!.statusChanges, control!.valueChanges)
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.updateErrorMessage(controlName));
    });
  }

  ngOnInit() {
    if (this.data.id) {
      this.getTaskById(this.data.id);
    }
  }

  private getTaskById(_id: string) {
    const getTaskById$ = this.taskService.getById(_id);

    lastValueFrom(getTaskById$, { defaultValue: null }).then((data) => {
      if (data) {
        this.form.patchValue({ ...data });
      }
    });
  }

  updateErrorMessage(controlName: string) {
    const control = this.form.get(controlName);
    if (!control) return;

    const messages = this.validationMessages[controlName];
    let message = '';

    for (const errorKey in control.errors ?? {}) {
      if (messages?.[errorKey]) {
        message = messages[errorKey];
        break;
      }
    }

    this.errorMessages[controlName].set(message);
  }

  close(value: boolean) {
    this.dialogRef.close(value);
  }

  onSubmit() {
    if (this.form.valid) {
      const data = {
        title: this.titleControl.value,
        description: this.descriptionControl.value,
        completed: this.completedControl.value,
      };

      const createTask$ = this.taskService.create(data);
      const editTask$ = this.taskService.update(this.data.id!, data);

      lastValueFrom(this.data.id ? editTask$ : createTask$, {
        defaultValue: null,
      }).then((response) => {
        if (response) {
          this.close(true);
        }
      });
    }
  }
}
