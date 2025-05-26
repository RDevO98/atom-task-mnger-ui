import {
  Component,
  computed,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import {
  MatChip,
  MatChipListbox,
  MatChipListboxChange,
  MatChipOption,
  MatChipSelectionChange,
  MatChipSet,
} from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';
import { lastValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../../login/infrastructure/services/auth.service';
import { TaskService } from '../../../infrastructure/services/task.service';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { Task } from '../../../domain/task.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    DatePipe,
    MatToolbar,
    MatIcon,
    MatIconButton,
    MatTooltip,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardActions,
    MatCardContent,
    MatChipSet,
    MatChip,
    MatFabButton,
    MatChipListbox,
    MatChipOption,
    MatToolbarRow,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent {
  readonly dialog = inject(MatDialog);
  readonly authService = inject(AuthService);
  readonly tasksService = inject(TaskService);

  filter = signal<'all' | 'completed' | 'pending'>('all');

  readonly taskList: WritableSignal<Array<Task>> = signal([]);

  readonly filteredTasks = computed(() => {
    const tasks = this.taskList();
    const currentFilter = this.filter();

    if (currentFilter === 'all') return tasks;
    if (currentFilter === 'completed') return tasks.filter((t) => t.completed);
    return tasks.filter((t) => !t.completed);
  });

  ngOnInit() {
    this.getData();
  }

  getData() {
    const $taskList = this.tasksService.getAll();

    lastValueFrom($taskList, { defaultValue: null }).then((data) => {
      if (data) {
        this.taskList.set(data);
      }
    });
  }

  openTaskForm(id: string | null = null) {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      data: {
        id,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getData();
      }
    });
  }

  deleteTask(id: string) {
    const deleteTask$ = this.tasksService.delete(id);

    lastValueFrom(deleteTask$, { defaultValue: null }).then(() => {
      this.getData();
    });
  }

  completeTask(
    event: MatChipSelectionChange,
    item: {
      id: string;
      title: string;
      description: string;
      completed: boolean;
      createdAt: string;
    }
  ) {
    if (event.isUserInput) {
      const data = {
        title: item.title,
        description: item.description,
        completed: event.selected,
      };

      const updateTask$ = this.tasksService.update(item.id, data);

      lastValueFrom(updateTask$, {
        defaultValue: null,
      }).then((response) => {
        if (response) {
          this.getData();
        }
      });
    }
  }

  setFilter(event: MatChipListboxChange) {
    const { value } = event;

    if (value === 'all' || value === 'completed' || value === 'pending') {
      this.filter.set(value);
    }
  }

  logout() {
    this.authService.logout();
  }
}
