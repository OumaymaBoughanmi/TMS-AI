import { PartialType } from '@nestjs/mapped-types';
import { CreateChatConversationDto } from './create-chat-conversation.dto';

export class UpdateChatConversationDto extends PartialType(CreateChatConversationDto) {}
