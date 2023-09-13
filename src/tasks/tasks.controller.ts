import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dtos/update-task-status.dto';
import { TaskEntity } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() tasksFilterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
    return this.tasksService.getTasks(tasksFilterDto);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('/:taskId')
  getTaskById(@Param('taskId') taskId: string): Promise<TaskEntity> {
    return this.tasksService.getTaskById(taskId);
  }

  @Delete('/:taskId')
  deleteTask(@Param('taskId') taskId: string): Promise<void> {
    return this.tasksService.deleteTask(taskId);
  }

  @Patch('/:taskId/status')
  updateTaskStatus(
    @Param('taskId') taskId: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<TaskEntity> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(taskId, status);
  }
}
