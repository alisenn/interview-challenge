import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from '../entities/assignment.entity';
import { Medication } from '../entities/medication.entity';
import { Patient } from '../entities/patient.entity';
import { AssignmentService } from '../services/assignment.service';

describe('AssignmentService', () => {
  let service: AssignmentService;
  let assignmentRepository: Repository<Assignment>;
  let patientRepository: Repository<Patient>;
  let medicationRepository: Repository<Medication>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignmentService,
        {
          provide: getRepositoryToken(Assignment),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Patient),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Medication),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AssignmentService>(AssignmentService);
    assignmentRepository = module.get<Repository<Assignment>>(getRepositoryToken(Assignment));
    patientRepository = module.get<Repository<Patient>>(getRepositoryToken(Patient));
    medicationRepository = module.get<Repository<Medication>>(getRepositoryToken(Medication));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateRemainingDays', () => {
    it('should calculate positive remaining days for future treatment end', () => {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 5); // Started 5 days ago
      const numberOfDays = 10; // 10-day treatment

      const remainingDays = service.calculateRemainingDays(startDate, numberOfDays);
      
      expect(remainingDays).toBe(5); // 5 days remaining
    });

    it('should calculate zero remaining days for treatment ending today', () => {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 7); // Started 7 days ago
      const numberOfDays = 7; // 7-day treatment

      const remainingDays = service.calculateRemainingDays(startDate, numberOfDays);
      
      expect(remainingDays).toBe(0); // Treatment ends today
    });

    it('should calculate negative remaining days for expired treatment', () => {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 10); // Started 10 days ago
      const numberOfDays = 7; // 7-day treatment

      const remainingDays = service.calculateRemainingDays(startDate, numberOfDays);
      
      expect(remainingDays).toBe(-3); // Treatment expired 3 days ago
    });

    it('should calculate remaining days for treatment starting today', () => {
      const today = new Date();
      const startDate = new Date(today); // Starting today
      const numberOfDays = 14; // 14-day treatment

      const remainingDays = service.calculateRemainingDays(startDate, numberOfDays);
      
      expect(remainingDays).toBe(14); // Full treatment duration remaining
    });

    it('should calculate remaining days for future treatment start', () => {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() + 3); // Starts in 3 days
      const numberOfDays = 7; // 7-day treatment

      const remainingDays = service.calculateRemainingDays(startDate, numberOfDays);
      
      expect(remainingDays).toBe(10); // 3 days until start + 7 days treatment
    });

    it('should handle single day treatment', () => {
      const today = new Date();
      const startDate = new Date(today); // Starting today
      const numberOfDays = 1; // 1-day treatment

      const remainingDays = service.calculateRemainingDays(startDate, numberOfDays);
      
      expect(remainingDays).toBe(1); // 1 day remaining
    });
  });
});
