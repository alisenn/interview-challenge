import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentController } from '../controllers/assignment.controller';
import { Assignment } from '../entities/assignment.entity';
import { Medication } from '../entities/medication.entity';
import { Patient } from '../entities/patient.entity';
import { AssignmentService } from '../services/assignment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, Patient, Medication])],
  controllers: [AssignmentController],
  providers: [AssignmentService],
  exports: [AssignmentService],
})
export class AssignmentModule {}
