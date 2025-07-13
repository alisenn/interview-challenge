import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateAssignmentDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  patientId: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  medicationId: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  numberOfDays: number;
}

export class UpdateAssignmentDto {
  @IsDateString()
  startDate?: string;

  @IsNumber()
  @IsPositive()
  numberOfDays?: number;
}
