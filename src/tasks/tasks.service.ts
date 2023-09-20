import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-task-filter.dto';
import { TaskRepository } from './tasks.repository';
import { TaskEntity } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<TaskEntity[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<TaskEntity> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async getTaskById(taskId: string, user: User): Promise<TaskEntity> {
    const found = await this.taskRepository.findOne({
      where: { id: taskId, user },
    });

    if (!found) {
      throw new NotFoundException(`Task ID ${taskId} not found`);
    }

    return found;
  }

  async deleteTask(taskId: string, user: User): Promise<void> {
    const result = await this.taskRepository.delete({
      id: taskId,
      user,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
  }

  async updateTaskStatus(
    taskId: string,
    status: TaskStatus,
    user: User,
  ): Promise<TaskEntity> {
    const task = await this.getTaskById(taskId, user);

    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
}
