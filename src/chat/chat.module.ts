import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Chat } from '@/database/entities';

@Module({
  imports: [MikroOrmModule.forFeature([Chat])],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
