import { IsDateString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateAssignmentDto {
  @IsNumber()
  @IsNotEmpty()
  patientId: number;

  @IsNumber()
  @IsNotEmpty()
  medicationId: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

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
