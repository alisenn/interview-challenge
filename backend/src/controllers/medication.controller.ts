import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, ValidationPipe } from '@nestjs/common';
import { CreateMedicationDto, UpdateMedicationDto } from '../dto/medication.dto';
import { MedicationService } from '../services/medication.service';

@Controller('medications')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  @Post()
  create(@Body(ValidationPipe) createMedicationDto: CreateMedicationDto) {
    return this.medicationService.create(createMedicationDto);
  }

  @Get()
  findAll() {
    return this.medicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medicationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateMedicationDto: UpdateMedicationDto,
  ) {
    return this.medicationService.update(id, updateMedicationDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.medicationService.remove(id);
    return { message: 'Medication deleted successfully', statusCode: HttpStatus.OK };
  }
}
