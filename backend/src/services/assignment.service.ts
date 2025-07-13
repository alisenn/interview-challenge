import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAssignmentDto, UpdateAssignmentDto } from '../dto/assignment.dto';
import { Assignment } from '../entities/assignment.entity';
import { Medication } from '../entities/medication.entity';
import { Patient } from '../entities/patient.entity';
import { DateUtils } from '../utils/date.utils';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Medication)
    private readonly medicationRepository: Repository<Medication>,
  ) {}

  async create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    // Verify patient exists
    const patient = await this.patientRepository.findOne({
      where: { id: createAssignmentDto.patientId },
    });
    if (!patient) {
      throw new BadRequestException(`Patient with ID ${createAssignmentDto.patientId} not found`);
    }

    // Verify medication exists
    const medication = await this.medicationRepository.findOne({
      where: { id: createAssignmentDto.medicationId },
    });
    if (!medication) {
      throw new BadRequestException(`Medication with ID ${createAssignmentDto.medicationId} not found`);
    }

    const assignment = this.assignmentRepository.create({
      ...createAssignmentDto,
      startDate: new Date(createAssignmentDto.startDate),
    });

    return this.assignmentRepository.save(assignment);
  }

  async findAll(): Promise<Assignment[]> {
    const assignments = await this.assignmentRepository.find({
      relations: ['patient', 'medication'],
      order: { createdAt: 'DESC' },
    });

    return assignments.map(assignment => this.addRemainingDays(assignment));
  }

  async findOne(id: number): Promise<Assignment> {
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
      relations: ['patient', 'medication'],
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return this.addRemainingDays(assignment);
  }

  async update(id: number, updateAssignmentDto: UpdateAssignmentDto): Promise<Assignment> {
    const assignment = await this.findOne(id);
    
    const updateData = {
      ...updateAssignmentDto,
      ...(updateAssignmentDto.startDate && { startDate: new Date(updateAssignmentDto.startDate) }),
    };

    Object.assign(assignment, updateData);
    const savedAssignment = await this.assignmentRepository.save(assignment);
    return this.addRemainingDays(savedAssignment);
  }

  async remove(id: number): Promise<void> {
    const assignment = await this.findOne(id);
    await this.assignmentRepository.remove(assignment);
  }

  /**
   * Calculate remaining days of treatment
   * Formula: (startDate + numberOfDays) - today
   */
  calculateRemainingDays(startDate: Date, numberOfDays: number): number {
    return DateUtils.calculateRemainingDays(startDate, numberOfDays);
  }

  private addRemainingDays(assignment: Assignment): Assignment {
    assignment.remainingDays = this.calculateRemainingDays(assignment.startDate, assignment.numberOfDays);
    return assignment;
  }
}
