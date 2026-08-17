import { Test, TestingModule } from '@nestjs/testing';
import { ChatConversationsController } from './chat-conversations.controller';
import { ChatConversationsService } from './chat-conversations.service';

describe('ChatConversationsController', () => {
  let controller: ChatConversationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatConversationsController],
      providers: [ChatConversationsService],
    }).compile();

    controller = module.get<ChatConversationsController>(ChatConversationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
