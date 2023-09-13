import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-task-filter.dto';
import { TaskRepository } from './tasks.repository';
import { TaskEntity } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  getTasks(filterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async getTaskById(taskId: string): Promise<TaskEntity> {
    const found = await this.taskRepository.findOne({ where: { id: taskId } });

    if (!found) {
      throw new NotFoundException(`Task ID ${taskId} not found`);
    }

    return found;
  }

  async deleteTask(taskId: string): Promise<void> {
    const result = await this.taskRepository.delete(taskId);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
  }

  async updateTaskStatus(
    taskId: string,
    status: TaskStatus,
  ): Promise<TaskEntity> {
    const task = await this.getTaskById(taskId);

    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
}
