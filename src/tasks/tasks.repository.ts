/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TaskEntity } from './task.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TaskRepository extends Repository<TaskEntity> {
  constructor(private dataSource: DataSource) {
    super(TaskEntity, dataSource.createEntityManager());
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<TaskEntity[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user })

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<TaskEntity> {
    const { title, description } = createTaskDto;
    
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    });

    await this.save(task);

    return task;
  }
}
