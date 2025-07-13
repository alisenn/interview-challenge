import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, ValidationPipe } from '@nestjs/common';
import { CreatePatientDto, UpdatePatientDto } from '../dto/patient.dto';
import { PatientService } from '../services/patient.service';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  create(@Body(ValidationPipe) createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @Get()
  findAll() {
    return this.patientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.patientService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientService.update(id, updatePatientDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.patientService.remove(id);
    return { message: 'Patient deleted successfully', statusCode: HttpStatus.OK };
  }
}
