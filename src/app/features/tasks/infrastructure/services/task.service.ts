import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../domain/task.model';
import { CreateOrUpdateTask } from '../../application/dto/create-update-task.dto';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Array<Task>>(`${this.apiUrl}`);
  }

  getById(id: string) {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateOrUpdateTask) {
    return this.http.post<void>(`${this.apiUrl}`, data);
  }

  update(id: string, data: CreateOrUpdateTask) {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
