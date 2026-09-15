import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class TalendConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  apiUrl: string;

  @Column()
  apiToken: string;

  @Column({ default: true })
  isActive: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}