import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AskQuestionDto } from './dto/ask-question.dto';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)// Secures the endpoint. Requires Bearer Token.
export class ChatController {
    constructor(private readonly chatService: ChatService){}

    @Post('ask')
    async askQuestion(@Request() req, @Body() askQuestionDto: AskQuestionDto){
        // req.user is automatically populated by the JwtAuthGUard
        const userId = req.user.sub;
        const { question } = askQuestionDto;

        const answer = await this.chatService.askQuestion(userId, question);

        return {
            success: true,
            answer: answer,
        };
    }
}
