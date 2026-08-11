import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum JobStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  RUNNING = 'RUNNING',
}

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.RUNNING,
  })
  status: JobStatus;

  @Column({ nullable: true })
  lastRunAt: Date;

  @Column({ nullable: true })
  duration: number;

  @Column({ nullable: true })
  errorMessage: string;

  @Column({ nullable: true })
  server: string;

  @CreateDateColumn()
  createdAt: Date;
}