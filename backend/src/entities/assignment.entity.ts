import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Medication } from './medication.entity';
import { Patient } from './patient.entity';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'integer' })
  numberOfDays: number;

  @ManyToOne(() => Patient, patient => patient.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column()
  patientId: number;

  @ManyToOne(() => Medication, medication => medication.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medicationId' })
  medication: Medication;

  @Column()
  medicationId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual property for remaining days
  remainingDays?: number;
}
