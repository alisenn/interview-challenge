import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Assignment } from './assignment.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @OneToMany(() => Assignment, assignment => assignment.patient, { cascade: true })
  assignments: Assignment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
