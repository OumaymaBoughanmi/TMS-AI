import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatConversationsService } from '../chat-conversations/chat-conversations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('chatbot')
export class ChatbotController {
  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly chatConversationsService: ChatConversationsService,
  ) {}

  @Post('ask')
  async ask(
    @Body('question') question: string,
    @Body('conversationId') conversationId: number,
    @Req() req: any,
  ) {
    const userId = req.user.userId;

    await this.chatConversationsService.addMessage(conversationId, userId, {
      role: 'user',
      text: question,
    });

    const answer = await this.chatbotService.ask(question);

    await this.chatConversationsService.addMessage(conversationId, userId, {
      role: 'assistant',
      text: answer,
    });

    return { answer };
  }
}