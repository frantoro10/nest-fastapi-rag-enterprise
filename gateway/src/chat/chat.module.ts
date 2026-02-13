// gateway/src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    // Register HttpModule. can optionally add global timeouts here.
    HttpModule.register({
      timeout: 30000, // 30 seconds max wait time for the AI to respond
      maxRedirects: 5,
    }),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}