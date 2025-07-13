import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMedicationDto, UpdateMedicationDto } from '../dto/medication.dto';
import { Medication } from '../entities/medication.entity';

@Injectable()
export class MedicationService {
  constructor(
    @InjectRepository(Medication)
    private readonly medicationRepository: Repository<Medication>,
  ) {}

  async create(createMedicationDto: CreateMedicationDto): Promise<Medication> {
    const medication = this.medicationRepository.create(createMedicationDto);
    return this.medicationRepository.save(medication);
  }

  async findAll(): Promise<Medication[]> {
    return this.medicationRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Medication> {
    const medication = await this.medicationRepository.findOne({
      where: { id },
      relations: ['assignments', 'assignments.patient'],
    });

    if (!medication) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }

    return medication;
  }

  async update(id: number, updateMedicationDto: UpdateMedicationDto): Promise<Medication> {
    const medication = await this.findOne(id);
    Object.assign(medication, updateMedicationDto);
    return this.medicationRepository.save(medication);
  }

  async remove(id: number): Promise<void> {
    const medication = await this.findOne(id);
    await this.medicationRepository.remove(medication);
  }
}
