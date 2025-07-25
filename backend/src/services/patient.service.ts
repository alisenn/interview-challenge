import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatientDto, UpdatePatientDto } from '../dto/patient.dto';
import { Patient } from '../entities/patient.entity';
import { DateUtils } from '../utils/date.utils';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientRepository.create({
      ...createPatientDto,
      dateOfBirth: new Date(createPatientDto.dateOfBirth),
    });
    return this.patientRepository.save(patient);
  }

  async findAll(): Promise<Patient[]> {
    const patients = await this.patientRepository.find({
      relations: ['assignments', 'assignments.medication'],
      order: { createdAt: 'DESC' },
    });

    return patients.map(patient => this.addRemainingDaysToAssignments(patient));
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['assignments', 'assignments.medication'],
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return this.addRemainingDaysToAssignments(patient);
  }

  async update(id: number, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);
    
    const updateData = {
      ...updatePatientDto,
      ...(updatePatientDto.dateOfBirth && { dateOfBirth: new Date(updatePatientDto.dateOfBirth) }),
    };

    Object.assign(patient, updateData);
    return this.patientRepository.save(patient);
  }

  async remove(id: number): Promise<void> {
    const patient = await this.findOne(id);
    await this.patientRepository.remove(patient);
  }

  private addRemainingDaysToAssignments(patient: Patient): Patient {
    if (patient.assignments) {
      patient.assignments = patient.assignments.map(assignment => {
        assignment.remainingDays = DateUtils.calculateRemainingDays(assignment.startDate, assignment.numberOfDays);
        return assignment;
      });
    }
    return patient;
  }
}
