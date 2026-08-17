import { Controller, Get, Post, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { ChatConversationsService } from './chat-conversations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('chat-conversations')
export class ChatConversationsController {
  constructor(private readonly chatConversationsService: ChatConversationsService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.chatConversationsService.findAllForUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.chatConversationsService.findOne(+id, req.user.userId);
  }

  @Post()
  create(@Req() req: any) {
    return this.chatConversationsService.create(req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.chatConversationsService.remove(+id, req.user.userId);
  }
}