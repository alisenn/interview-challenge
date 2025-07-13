import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Assignment } from './assignment.entity';

@Entity('medications')
export class Medication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  dosage: string;

  @Column({ type: 'varchar', length: 100 })
  frequency: string;

  @OneToMany(() => Assignment, assignment => assignment.medication, { cascade: true })
  assignments: Assignment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
