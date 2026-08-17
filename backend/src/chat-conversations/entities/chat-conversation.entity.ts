import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ChatConversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ default: 'New conversation' })
  title: string;

  @Column({ type: 'jsonb', default: [] })
  messages: { role: 'user' | 'assistant'; text: string; timestamp: string }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}