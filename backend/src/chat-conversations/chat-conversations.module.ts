import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatConversationsService } from './chat-conversations.service';
import { ChatConversationsController } from './chat-conversations.controller';
import { ChatConversation } from './entities/chat-conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatConversation])],
  controllers: [ChatConversationsController],
  providers: [ChatConversationsService],
  exports: [ChatConversationsService],
})
export class ChatConversationsModule {}