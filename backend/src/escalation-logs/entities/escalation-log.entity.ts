import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class EscalationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  incidentId: number;

  @Column()
  incidentTitle: string;

  @Column()
  severity: string;

  @Column({ nullable: true })
  minutesOpen: number;

  @Column({ default: 'Level 1 — Support Team' })
  escalatedTo: string;

  @CreateDateColumn()
  escalatedAt: Date;
}