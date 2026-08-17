import { Test, TestingModule } from '@nestjs/testing';
import { ChatConversationsService } from './chat-conversations.service';

describe('ChatConversationsService', () => {
  let service: ChatConversationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatConversationsService],
    }).compile();

    service = module.get<ChatConversationsService>(ChatConversationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
