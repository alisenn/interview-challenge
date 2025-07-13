import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;
}

export class UpdatePatientDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsDateString()
  dateOfBirth?: string;
}
