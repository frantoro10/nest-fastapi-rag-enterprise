import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ChatService {
    private readonly logger = new Logger(ChatService.name);
    private readonly pythonApiUrl: string;

    constructor (
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        // Retrieve the URL from .env
        this.pythonApiUrl = this.configService.get<string>('PYTHON_API_URL') || "";
    }

    /**
   * Sends the user's question to the Python AI engine and retrieves the answer.
   * @param userId The ID of the authenticated user.
   * @param question The question string.
   * @returns The generated response from the LLM.
   */

    async askQuestion(userId: string, question: string) {
        try{
            this.logger.log(`Sending question to AI engine for user: ${userId}`);

            // Perform synchronous HTTP POST to the Python microservice
            // We use lastValueFrom to convert the observable returned by HttpService into a Promise
            const response = await lastValueFrom(
                this.httpService.post(`${this.pythonApiUrl}/api/chat`, {
                    userId,
                    question: question,
                }), 
            );

            this.logger.log(`Received response from AI engine: ${response.data}`);
            return response.data.answer;
        } catch (error) {
            this.logger.error(`Failed to communicate with AI Engine: ${error.message}`);
            throw new InternalServerErrorException('AI Engine is currently unavailable');
        }
    }
}
