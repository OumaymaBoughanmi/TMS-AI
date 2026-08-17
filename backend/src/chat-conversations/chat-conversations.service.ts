import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatConversation } from './entities/chat-conversation.entity';

@Injectable()
export class ChatConversationsService {
  constructor(
    @InjectRepository(ChatConversation)
    private conversationRepository: Repository<ChatConversation>,
  ) {}

  findAllForUser(userId: number) {
    return this.conversationRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });
  }

  findOne(id: number, userId: number) {
    return this.conversationRepository.findOne({ where: { id, userId } });
  }

  create(userId: number) {
    const conversation = this.conversationRepository.create({
      userId,
      title: 'New conversation',
      messages: [],
    });
    return this.conversationRepository.save(conversation);
  }

  async addMessage(
    id: number,
    userId: number,
    message: { role: 'user' | 'assistant'; text: string },
  ) {
    const conversation = await this.findOne(id, userId);
    if (!conversation) return null;

    conversation.messages = [
      ...conversation.messages,
      { ...message, timestamp: new Date().toISOString() },
    ];

    // Auto-title from the first user message
    if (conversation.title === 'New conversation' && message.role === 'user') {
      conversation.title = message.text.slice(0, 50) + (message.text.length > 50 ? '...' : '');
    }

    return this.conversationRepository.save(conversation);
  }

  async remove(id: number, userId: number) {
    const conversation = await this.findOne(id, userId);
    if (!conversation) return null;
    return this.conversationRepository.remove(conversation);
  }
}