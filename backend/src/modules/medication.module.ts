import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationController } from '../controllers/medication.controller';
import { Medication } from '../entities/medication.entity';
import { MedicationService } from '../services/medication.service';

@Module({
  imports: [TypeOrmModule.forFeature([Medication])],
  controllers: [MedicationController],
  providers: [MedicationService],
  exports: [MedicationService],
})
export class MedicationModule {}
