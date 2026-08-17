import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { Job } from '../jobs/entities/job.entity';
import { Incident } from '../incidents/entities/incident.entity';
import { Infrastructure } from '../infrastructure/entities/infrastructure.entity';
import { User } from '../user/entities/user.entity';
import { Log } from '../logs/entities/log.entity';
import { ChatConversationsModule } from '../chat-conversations/chat-conversations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, Incident, Infrastructure, User, Log]),
    ChatConversationsModule,
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}