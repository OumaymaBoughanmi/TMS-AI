import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum CheckType {
  DATABASE = 'DATABASE',
  SERVER = 'SERVER',
}

export enum CheckStatus {
  UP = 'UP',
  DOWN = 'DOWN',
}

@Entity()
export class Infrastructure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g. "PostgreSQL Database" or "srv-etl-01"

  @Column({
    type: 'enum',
    enum: CheckType,
  })
  type: CheckType;

  @Column({
    type: 'enum',
    enum: CheckStatus,
    default: CheckStatus.UP,
  })
  status: CheckStatus;

  @Column({ nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  checkedAt: Date;
}