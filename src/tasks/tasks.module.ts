import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskRepository } from './tasks.repository';
import { TaskEntity } from './task.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService, TaskRepository],
})
export class TasksModule {}
