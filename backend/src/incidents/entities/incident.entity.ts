import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum IncidentSource {
  JOB = 'JOB',
  DATABASE = 'DATABASE',
  SERVER = 'SERVER',
}

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum IncidentStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
}

@Entity()
export class Incident {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: IncidentSource,
  })
  source: IncidentSource;

  @Column({
    type: 'enum',
    enum: IncidentSeverity,
    default: IncidentSeverity.MEDIUM,
  })
  severity: IncidentSeverity;

  @Column({
    type: 'enum',
    enum: IncidentStatus,
    default: IncidentStatus.OPEN,
  })
  status: IncidentStatus;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  probableCause: string;

  @Column({ type: 'text', nullable: true })
  aiSuggestion: string;

  @Column({ nullable: true })
  relatedJobName: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  resolvedAt: Date;

  @Column({ default: false })
  escalated: boolean;

  @Column({ nullable: true })
  escalatedAt: Date;
}